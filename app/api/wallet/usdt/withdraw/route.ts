import {
  createClient,
} from "@supabase/supabase-js";

import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  TronWeb,
} from "tronweb";

export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";

type WithdrawalRequestBody = {
  destinationAddress?:
    unknown;

  amount?:
    unknown;

  idempotencyKey?:
    unknown;
};

type WithdrawalResult = {
  success?:
    boolean;

  created?:
    boolean;

  duplicate?:
    boolean;

  withdrawalId?:
    string;

  network?:
    string;

  destinationAddress?:
    string;

  amount?:
    string
    | number;

  fee?:
    string
    | number;

  netAmount?:
    string
    | number;

  status?:
    string;

  createdAt?:
    string;
};

function getBearerToken(
  request:
    NextRequest
) {
  const authorization =
    request.headers
      .get(
        "authorization"
      )
      ?.trim();

  if (
    !authorization
  ) {
    return null;
  }

  const match =
    authorization.match(
      /^Bearer\s+(.+)$/i
    );

  const token =
    match?.[1]
      ?.trim();

  return (
    token ||
    null
  );
}

function getConfiguredNetwork() {
  const network =
    process.env
      .TRON_DEPOSIT_NETWORK
      ?.trim()
      .toUpperCase();

  if (
    network !==
      "SHASTA" &&
    network !==
      "MAINNET"
  ) {
    throw new Error(
      "TRON_DEPOSIT_NETWORK must be SHASTA or MAINNET."
    );
  }

  return network;
}

function getSupabaseUrl() {
  const value =
    process.env
      .NEXT_PUBLIC_SUPABASE_URL;

  if (
    !value
  ) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL is not configured."
    );
  }

  return value;
}

function getSupabaseAnonKey() {
  const value =
    process.env
      .NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (
    !value
  ) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY is not configured."
    );
  }

  return value;
}

function getServiceRoleKey() {
  const value =
    process.env
      .SUPABASE_SERVICE_ROLE_KEY;

  if (
    !value
  ) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not configured."
    );
  }

  return value;
}

function getUserClient(
  accessToken:
    string
) {
  return createClient(
    getSupabaseUrl(),

    getSupabaseAnonKey(),

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
}

function getAdminClient() {
  return createClient(
    getSupabaseUrl(),

    getServiceRoleKey(),

    {
      auth: {
        persistSession:
          false,

        autoRefreshToken:
          false,
      },
    }
  );
}

function parseDestinationAddress(
  value:
    unknown
) {
  if (
    typeof value !==
    "string"
  ) {
    throw new Error(
      "TRON destination address is required."
    );
  }

  const address =
    value.trim();

  if (
    !address ||
    !TronWeb.isAddress(
      address
    )
  ) {
    throw new Error(
      "TRON destination address is invalid."
    );
  }

  return address;
}

function parseAmount(
  value:
    unknown
) {
  const amount =
    typeof value ===
      "number"
      ? String(
          value
        )
      : typeof value ===
          "string"
        ? value.trim()
        : "";

  if (
    !/^(?:0|[1-9]\d{0,23})(?:\.\d{1,6})?$/.test(
      amount
    )
  ) {
    throw new Error(
      "USDT amount is invalid."
    );
  }

  const numericAmount =
    Number(
      amount
    );

  if (
    !Number.isFinite(
      numericAmount
    ) ||
    numericAmount <=
      0
  ) {
    throw new Error(
      "USDT amount must be greater than zero."
    );
  }

  return amount;
}

function parseIdempotencyKey(
  value:
    unknown
) {
  if (
    typeof value !==
    "string"
  ) {
    throw new Error(
      "Idempotency key is required."
    );
  }

  const key =
    value
      .trim()
      .toLowerCase();

  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(
      key
    )
  ) {
    throw new Error(
      "Idempotency key is invalid."
    );
  }

  return key;
}

export async function POST(
  request:
    NextRequest
) {
  try {
    const accessToken =
      getBearerToken(
        request
      );

    if (
      !accessToken
    ) {
      return NextResponse.json(
        {
          success:
            false,

          error:
            "Unauthorized.",
        },

        {
          status:
            401,

          headers: {
            "Cache-Control":
              "no-store",
          },
        }
      );
    }

    const userClient =
      getUserClient(
        accessToken
      );

    const {
      data:
        userData,

      error:
        userError,
    } =
      await userClient
        .auth
        .getUser();

    if (
      userError ||
      !userData.user
    ) {
      return NextResponse.json(
        {
          success:
            false,

          error:
            "Unauthorized.",
        },

        {
          status:
            401,

          headers: {
            "Cache-Control":
              "no-store",
          },
        }
      );
    }

    let body:
      WithdrawalRequestBody;

    try {
      body =
        (
          await request.json()
        ) as
          WithdrawalRequestBody;
    } catch {
      return NextResponse.json(
        {
          success:
            false,

          error:
            "Invalid request body.",
        },

        {
          status:
            400,

          headers: {
            "Cache-Control":
              "no-store",
          },
        }
      );
    }

    const destinationAddress =
      parseDestinationAddress(
        body
          .destinationAddress
      );

    const amount =
      parseAmount(
        body.amount
      );

    const idempotencyKey =
      parseIdempotencyKey(
        body
          .idempotencyKey
      );

    const network =
      getConfiguredNetwork();

    const adminClient =
      getAdminClient();

    const {
      data,

      error,
    } =
      await adminClient.rpc(
        "create_usdt_withdrawal",

        {
          p_user_id:
            userData
              .user
              .id,

          p_network:
            network,

          p_destination_address:
            destinationAddress,

          p_amount:
            amount,

          p_idempotency_key:
            idempotencyKey,
        }
      );

    if (
      error
    ) {
      const status =
        error.message.includes(
          "Insufficient USDT balance"
        )
          ? 400
          : 400;

      return NextResponse.json(
        {
          success:
            false,

          error:
            error.message,
        },

        {
          status,

          headers: {
            "Cache-Control":
              "no-store",
          },
        }
      );
    }

    const result =
      data as
        | WithdrawalResult
        | null;

    if (
      !result ||
      result.success !==
        true
    ) {
      throw new Error(
        "USDT withdrawal request was not created."
      );
    }

    return NextResponse.json(
      {
        success:
          true,

        withdrawal:
          result,
      },

      {
        status:
          result.created ===
          true
            ? 201
            : 200,

        headers: {
          "Cache-Control":
            "no-store",
        },
      }
    );
  } catch (
    error
  ) {
    const message =
      error instanceof
      Error
        ? error.message
        : "USDT withdrawal request failed.";

    console.error(
      "USDT withdrawal API error:",
      error
    );

    return NextResponse.json(
      {
        success:
          false,

        error:
          message,
      },

      {
        status:
          500,

        headers: {
          "Cache-Control":
            "no-store",
        },
      }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      success:
        false,

      error:
        "Method not allowed.",
    },

    {
      status:
        405,

      headers: {
        Allow:
          "POST",

        "Cache-Control":
          "no-store",
      },
    }
  );
}