import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UPDATE_INTERVAL_MS = 13 * 60 * 1000;

function getCronSecret() {
  const secret = process.env.CRON_SECRET?.trim();

  if (!secret) {
    throw new Error("CRON_SECRET is not configured.");
  }

  return secret;
}

function getBearerToken(request: NextRequest) {
  const authorization = request.headers
    .get("authorization")
    ?.trim();

  if (!authorization) {
    return null;
  }

  const match = authorization.match(/^Bearer\s+(.+)$/i);

  return match?.[1]?.trim() ?? null;
}

function secretsMatch(
  providedSecret: string,
  configuredSecret: string,
) {
  const providedBuffer = Buffer.from(providedSecret, "utf8");
  const configuredBuffer = Buffer.from(configuredSecret, "utf8");

  if (providedBuffer.length !== configuredBuffer.length) {
    return false;
  }

  return timingSafeEqual(providedBuffer, configuredBuffer);
}

function getAdminClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL is not configured.",
    );
  }

  if (!serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not configured.",
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

async function handleUpdate(request: NextRequest) {
  try {
    const providedSecret = getBearerToken(request);
    const configuredSecret = getCronSecret();

    if (
      !providedSecret ||
      !secretsMatch(providedSecret, configuredSecret)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const supabase = getAdminClient();

    const { data: currentPrice, error: readError } =
      await supabase
        .from("market_price")
        .select("price, updated_at")
        .eq("id", 1)
        .single();

    if (readError || !currentPrice) {
      return NextResponse.json(
        {
          success: false,
          error:
            readError?.message ??
            "Current price not found",
        },
        {
          status: 500,
        },
      );
    }

    const oldPrice = Number(currentPrice.price);
    const lastUpdatedAt = new Date(
      currentPrice.updated_at,
    ).getTime();

    if (
      !Number.isFinite(oldPrice) ||
      !Number.isFinite(lastUpdatedAt)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid market price data",
        },
        {
          status: 500,
        },
      );
    }

    const now = Date.now();
    const nextUpdateAt =
      lastUpdatedAt + UPDATE_INTERVAL_MS;

    if (now < nextUpdateAt) {
      return NextResponse.json({
        success: true,
        updated: false,
        reason: "Price update is not due yet",
        currentPrice: oldPrice,
        nextUpdateAt: new Date(
          nextUpdateAt,
        ).toISOString(),
      });
    }

    const movement =
      (Math.random() - 0.48) * 0.01;

    const calculatedPrice =
      oldPrice * (1 + movement);

    const newPrice = Number(
      Math.max(0.01, calculatedPrice).toFixed(8),
    );

    const updatedAt = new Date().toISOString();

    const { error: updateError } = await supabase
      .from("market_price")
      .update({
        price: newPrice,
        updated_at: updatedAt,
      })
      .eq("id", 1);

    if (updateError) {
      return NextResponse.json(
        {
          success: false,
          error: updateError.message,
        },
        {
          status: 500,
        },
      );
    }

    const { error: historyError } = await supabase
      .from("price_history")
      .insert({
        price: newPrice,
        created_at: updatedAt,
      });

    if (historyError) {
      return NextResponse.json(
        {
          success: false,
          error: historyError.message,
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json({
      success: true,
      updated: true,
      oldPrice,
      newPrice,
      updatedAt,
      nextUpdateAt: new Date(
        new Date(updatedAt).getTime() +
          UPDATE_INTERVAL_MS,
      ).toISOString(),
    });
  } catch (error) {
    console.error(
      "Market price Cron error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Server error",
      },
      {
        status: 500,
      },
    );
  }
}

export async function GET(request: NextRequest) {
  return handleUpdate(request);
}

export async function POST(request: NextRequest) {
  return handleUpdate(request);
}
