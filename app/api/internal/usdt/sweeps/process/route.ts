import {
  timingSafeEqual,
} from "crypto";

import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  processUsdtSweeps,
} from "@/lib/server/processUsdtSweeps";

export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";

function getConfiguredSecret() {
  const secret =
    process.env
      .USDT_DEPOSIT_SCAN_SECRET
      ?.trim();

  if (
    !secret
  ) {
    throw new Error(
      "USDT_DEPOSIT_SCAN_SECRET is not configured."
    );
  }

  return secret;
}

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

function secretsMatch(
  receivedSecret:
    string,

  configuredSecret:
    string
) {
  const receivedBuffer =
    Buffer.from(
      receivedSecret,
      "utf8"
    );

  const configuredBuffer =
    Buffer.from(
      configuredSecret,
      "utf8"
    );

  if (
    receivedBuffer.length !==
    configuredBuffer.length
  ) {
    return false;
  }

  return timingSafeEqual(
    receivedBuffer,
    configuredBuffer
  );
}

export async function POST(
  request:
    NextRequest
) {
  try {
    const configuredSecret =
      getConfiguredSecret();

    const receivedSecret =
      getBearerToken(
        request
      );

    if (
      !receivedSecret ||
      !secretsMatch(
        receivedSecret,
        configuredSecret
      )
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

    const result =
      await processUsdtSweeps();

    return NextResponse.json(
      {
        success:
          result.success,

        processing:
          result,
      },

      {
        status:
          result.success
            ? 200
            : 207,

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
        : "USDT sweep processing failed.";

    console.error(
      "USDT sweep processing error:",
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