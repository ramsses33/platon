import {
  timingSafeEqual,
} from "node:crypto";

import {
  NextResponse,
} from "next/server";

import {
  scanConfirmedUsdtDeposits,
} from "@/lib/server/scanUsdtDeposits";

export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";

export const maxDuration =
  60;

function jsonResponse(
  body:
    Record<
      string,
      unknown
    >,

  status =
    200
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

function getConfiguredSecret() {
  const secret =
    process.env
      .USDT_DEPOSIT_SCAN_SECRET
      ?.trim();

  if (
    !secret ||
    secret.length <
      32
  ) {
    throw new Error(
      "USDT_DEPOSIT_SCAN_SECRET is missing or too short."
    );
  }

  return secret;
}

function getBearerToken(
  request:
    Request
) {
  const authorization =
    request.headers.get(
      "authorization"
    );

  if (
    !authorization
      ?.startsWith(
        "Bearer "
      )
  ) {
    return null;
  }

  const token =
    authorization
      .slice(
        "Bearer ".length
      )
      .trim();

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
    Request
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
      return jsonResponse(
        {
          error:
            "Unauthorized",
        },

        401
      );
    }

    const scanResult =
      await scanConfirmedUsdtDeposits();

    return jsonResponse(
      {
        success:
          scanResult.success,

        scan:
          scanResult,
      },

      scanResult.success
        ? 200
        : 207
    );
  } catch (
    error
  ) {
    console.error(
      "USDT deposit scan API error:",
      error
    );

    return jsonResponse(
      {
        error:
          "USDT deposit scan failed.",
      },

      500
    );
  }
}

export async function GET() {
  return jsonResponse(
    {
      error:
        "Method not allowed",
    },

    405
  );
}