import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type PlaceOrderBody = {
  orderType?: unknown;
  price?: unknown;
  amount?: unknown;
};

type UserMatchResult = {
  matched?: boolean;
  buyRemaining?: number | string;
  sellRemaining?: number | string;
  [key: string]: unknown;
};

type TreasuryMatchResult = {
  matched?: boolean;
  remaining?: number | string;
  [key: string]: unknown;
};

const MAX_USER_MATCHES = 100;

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
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const accessToken =
      authorization
        .slice(
          "Bearer ".length
        )
        .trim();

    if (!accessToken) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const body =
      (await request.json()) as PlaceOrderBody;

    const orderType =
      typeof body.orderType ===
      "string"
        ? body.orderType
            .trim()
            .toUpperCase()
        : "";

    const price =
      Number(
        body.price
      );

    const amount =
      Number(
        body.amount
      );

    if (
      orderType !== "BUY" &&
      orderType !== "SELL"
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid order type",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !Number.isFinite(
        price
      ) ||
      price <= 0
    ) {
      return NextResponse.json(
        {
          error:
            "Price must be greater than zero",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !Number.isFinite(
        amount
      ) ||
      amount <= 0
    ) {
      return NextResponse.json(
        {
          error:
            "Amount must be greater than zero",
        },
        {
          status: 400,
        }
      );
    }

    const supabaseUrl =
      process.env
        .NEXT_PUBLIC_SUPABASE_URL;

    const anonKey =
      process.env
        .NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (
      !supabaseUrl ||
      !anonKey
    ) {
      console.error(
        "Supabase environment variables are missing."
      );

      return NextResponse.json(
        {
          error:
            "Server configuration is incomplete",
        },
        {
          status: 500,
        }
      );
    }

    /*
     * Все операции выполняются
     * от имени текущего пользователя.
     *
     * Это необходимо, потому что
     * защищённые SQL-функции используют:
     *
     * auth.uid()
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
      data: userData,
      error: userError,
    } =
      await userClient.auth.getUser(
        accessToken
      );

    if (
      userError ||
      !userData.user
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid or expired session",
        },
        {
          status: 401,
        }
      );
    }

    /*
     * ШАГ 1
     *
     * Создаём BUY или SELL ордер.
     */
    const {
      data: orderId,
      error: orderError,
    } = await userClient.rpc(
      "place_order",
      {
        requested_type:
          orderType,

        requested_price:
          price,

        requested_amount:
          amount,
      }
    );

    if (
      orderError ||
      !orderId
    ) {
      return NextResponse.json(
        {
          error:
            orderError?.message ||
            "Order could not be created",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * ШАГ 2
     *
     * Сначала исполняем ордер
     * против пользовательских ордеров.
     *
     * Функция исполняет одну встречную
     * заявку за один вызов, поэтому
     * вызываем её повторно, пока есть
     * встречные пользовательские ордера.
     */
    const userExecutions:
      UserMatchResult[] = [];

    let incomingRemaining =
      amount;

    for (
      let attempt = 0;
      attempt <
        MAX_USER_MATCHES;
      attempt += 1
    ) {
      const {
        data,
        error,
      } = await userClient.rpc(
        "execute_user_match",
        {
          incoming_order_id:
            orderId,
        }
      );

      if (error) {
        console.error(
          "User matching failed:",
          error
        );

        return NextResponse.json(
          {
            error:
              error.message,

            orderId,
          },
          {
            status: 500,
          }
        );
      }

      const userMatch =
        data as
          | UserMatchResult
          | null;

      if (
        !userMatch?.matched
      ) {
        break;
      }

      userExecutions.push(
        userMatch
      );

      const remainingValue =
        orderType === "BUY"
          ? Number(
              userMatch
                .buyRemaining
            )
          : Number(
              userMatch
                .sellRemaining
            );

      if (
        !Number.isFinite(
          remainingValue
        )
      ) {
        console.error(
          "Invalid remaining amount returned by execute_user_match."
        );

        return NextResponse.json(
          {
            error:
              "Invalid matching result",

            orderId,
          },
          {
            status: 500,
          }
        );
      }

      incomingRemaining =
        Math.max(
          0,
          remainingValue
        );

      if (
        incomingRemaining <= 0
      ) {
        const lastExecution =
          userExecutions[
            userExecutions.length -
              1
          ];

        return NextResponse.json(
          {
            success: true,

            orderId,

            executionSource:
              "USER",

            execution:
              lastExecution,

            userExecutions,

            remaining:
              0,
          }
        );
      }
    }

    /*
     * ШАГ 3
     *
     * Если после пользовательского
     * matching остался объём,
     * Treasury автоматически
     * выступает второй стороной сделки.
     */
    const {
      data:
        treasuryData,

      error:
        treasuryError,
    } = await userClient.rpc(
      "execute_treasury_match",
      {
        incoming_order_id:
          orderId,
      }
    );

    if (
      treasuryError
    ) {
      console.error(
        "Treasury matching failed:",
        treasuryError
      );

      return NextResponse.json(
        {
          error:
            treasuryError.message,

          orderId,
        },
        {
          status: 500,
        }
      );
    }

    const treasuryMatch =
      treasuryData as
        | TreasuryMatchResult
        | null;

    if (
      treasuryMatch?.matched
    ) {
      const treasuryRemaining =
        Number(
          treasuryMatch.remaining
        );

      return NextResponse.json(
        {
          success: true,

          orderId,

          executionSource:
            "TREASURY",

          execution:
            treasuryMatch,

          userExecutions,

          treasuryExecution:
            treasuryMatch,

          remaining:
            Number.isFinite(
              treasuryRemaining
            )
              ? Math.max(
                  0,
                  treasuryRemaining
                )
              : 0,
        }
      );
    }

    /*
     * Этот ответ возможен только если
     * Treasury отключён или достигнут
     * установленный резерв безопасности.
     */
    if (
      userExecutions.length >
      0
    ) {
      const lastExecution =
        userExecutions[
          userExecutions.length -
            1
        ];

      return NextResponse.json(
        {
          success: true,

          orderId,

          executionSource:
            "USER",

          execution:
            lastExecution,

          userExecutions,

          remaining:
            incomingRemaining,

          message:
            "Order was partially matched. Treasury execution is currently unavailable.",

          treasuryMatch,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,

        orderId,

        executionSource:
          "NONE",

        remaining:
          incomingRemaining,

        message:
          "Treasury execution is currently unavailable.",

        treasuryMatch,
      }
    );
  } catch (error) {
    console.error(
      "Market order API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}