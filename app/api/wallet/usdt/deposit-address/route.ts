import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import {
  deriveTronDepositWallet,
  type TronDepositNetwork,
} from "@/lib/server/tronDepositWallet";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type DepositAddressRow = {
  id: string;
  address: string;
  network: TronDepositNetwork;
  created_at: string;
};

function createJsonResponse(
  body: Record<string, unknown>,
  status = 200
) {
  return NextResponse.json(
    body,
    {
      status,

      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate",
      },
    }
  );
}

function getDepositNetwork():
  TronDepositNetwork {
  const network =
    process.env
      .TRON_DEPOSIT_NETWORK
      ?.trim()
      .toUpperCase();

  if (
    network !== "SHASTA" &&
    network !== "MAINNET"
  ) {
    throw new Error(
      "TRON_DEPOSIT_NETWORK must be SHASTA or MAINNET."
    );
  }

  return network;
}

export async function POST(
  request: Request
) {
  try {
    const authorization =
      request.headers.get(
        "authorization"
      );

    if (
      !authorization?.startsWith(
        "Bearer "
      )
    ) {
      return createJsonResponse(
        {
          error:
            "Unauthorized",
        },
        401
      );
    }

    const accessToken =
      authorization
        .slice(
          "Bearer ".length
        )
        .trim();

    if (
      !accessToken
    ) {
      return createJsonResponse(
        {
          error:
            "Unauthorized",
        },
        401
      );
    }

    const supabaseUrl =
      process.env
        .NEXT_PUBLIC_SUPABASE_URL;

    const anonKey =
      process.env
        .NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const serviceRoleKey =
      process.env
        .SUPABASE_SERVICE_ROLE_KEY;

    if (
      !supabaseUrl ||
      !anonKey ||
      !serviceRoleKey
    ) {
      console.error(
        "USDT deposit API configuration is incomplete."
      );

      return createJsonResponse(
        {
          error:
            "Server configuration is incomplete.",
        },
        500
      );
    }

    const network =
      getDepositNetwork();

    /*
     * Пользовательский клиент
     * нужен только для проверки
     * текущей авторизованной сессии.
     */
    const userClient =
      createClient(
        supabaseUrl,
        anonKey,
        {
          global: {
            headers: {
              Authorization:
                `Bearer ${accessToken}`,
            },
          },

          auth: {
            persistSession:
              false,

            autoRefreshToken:
              false,
          },
        }
      );

    const {
      data:
        userData,

      error:
        userError,
    } =
      await userClient.auth.getUser(
        accessToken
      );

    if (
      userError ||
      !userData.user
    ) {
      return createJsonResponse(
        {
          error:
            "Invalid or expired session.",
        },
        401
      );
    }

    const userId =
      userData.user.id;

    /*
     * Service Role используется
     * только на сервере.
     */
    const adminClient =
      createClient(
        supabaseUrl,
        serviceRoleKey,
        {
          auth: {
            persistSession:
              false,

            autoRefreshToken:
              false,
          },
        }
      );

    /*
     * Сначала проверяем:
     * возможно, адрес этому
     * пользователю уже создан.
     */
    const {
      data:
        existingAddress,

      error:
        existingAddressError,
    } =
      await adminClient
        .from(
          "usdt_deposit_addresses"
        )
        .select(
          `
            id,
            address,
            network,
            created_at
          `
        )
        .eq(
          "user_id",
          userId
        )
        .eq(
          "network",
          network
        )
        .maybeSingle();

    if (
      existingAddressError
    ) {
      console.error(
        "Unable to read existing USDT deposit address:",
        existingAddressError
      );

      return createJsonResponse(
        {
          error:
            "Unable to load deposit address.",
        },
        500
      );
    }

    if (
      existingAddress
    ) {
      const address =
        existingAddress as
          DepositAddressRow;

      return createJsonResponse({
        success:
          true,

        created:
          false,

        network:
          address.network,

        token:
          "USDT",

        standard:
          "TRC20",

        address:
          address.address,

        createdAt:
          address.created_at,
      });
    }

    /*
     * Получаем новый уникальный
     * derivation index.
     */
    const {
      data:
        derivationIndexData,

      error:
        derivationIndexError,
    } =
      await adminClient.rpc(
        "next_tron_deposit_derivation_index"
      );

    if (
      derivationIndexError
    ) {
      console.error(
        "Unable to allocate TRON derivation index:",
        derivationIndexError
      );

      return createJsonResponse(
        {
          error:
            "Unable to create deposit address.",
        },
        500
      );
    }

    const derivationIndex =
      Number(
        derivationIndexData
      );

    if (
      !Number.isSafeInteger(
        derivationIndex
      ) ||
      derivationIndex < 0
    ) {
      console.error(
        "Invalid TRON derivation index:",
        derivationIndexData
      );

      return createJsonResponse(
        {
          error:
            "Unable to create deposit address.",
        },
        500
      );
    }

    /*
     * Адрес создаётся только
     * внутри серверного процесса.
     *
     * Private key не сохраняется
     * в Supabase и не возвращается
     * пользователю.
     */
    const generatedWallet =
      deriveTronDepositWallet(
        derivationIndex
      );

    const {
      data:
        insertedAddress,

      error:
        insertError,
    } =
      await adminClient
        .from(
          "usdt_deposit_addresses"
        )
        .insert({
          user_id:
            userId,

          network,

          address:
            generatedWallet.address,

          derivation_index:
            derivationIndex,

          is_active:
            true,
        })
        .select(
          `
            id,
            address,
            network,
            created_at
          `
        )
        .single();

    if (
      insertError
    ) {
      /*
       * Защита от двух
       * одновременных запросов.
       *
       * Если другой запрос уже
       * создал адрес, просто
       * возвращаем существующий.
       */
      const {
        data:
          concurrentAddress,

        error:
          concurrentAddressError,
      } =
        await adminClient
          .from(
            "usdt_deposit_addresses"
          )
          .select(
            `
              id,
              address,
              network,
              created_at
            `
          )
          .eq(
            "user_id",
            userId
          )
          .eq(
            "network",
            network
          )
          .maybeSingle();

      if (
        !concurrentAddressError &&
        concurrentAddress
      ) {
        const address =
          concurrentAddress as
            DepositAddressRow;

        return createJsonResponse({
          success:
            true,

          created:
            false,

          network:
            address.network,

          token:
            "USDT",

          standard:
            "TRC20",

          address:
            address.address,

          createdAt:
            address.created_at,
        });
      }

      console.error(
        "Unable to save USDT deposit address:",
        insertError
      );

      return createJsonResponse(
        {
          error:
            "Unable to save deposit address.",
        },
        500
      );
    }

    const address =
      insertedAddress as
        DepositAddressRow;

    return createJsonResponse(
      {
        success:
          true,

        created:
          true,

        network:
          address.network,

        token:
          "USDT",

        standard:
          "TRC20",

        address:
          address.address,

        createdAt:
          address.created_at,
      },
      201
    );
  } catch (
    error
  ) {
    console.error(
      "USDT deposit address API error:",
      error
    );

    return createJsonResponse(
      {
        error:
          "Internal server error.",
      },
      500
    );
  }
}