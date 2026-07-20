import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TRANSACTIONS_LIMIT = 10;

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

  return createClient(
    supabaseUrl,
    serviceRoleKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );
}

export async function GET() {
  try {
    const supabase = getAdminClient();

    const {
      data,
      error,
    } = await supabase
      .from("transactions")
      .select(
        `
          id,
          sender_wallet,
          receiver_wallet,
          amount,
          type,
          status,
          created_at
        `,
      )
      .order("created_at", {
        ascending: false,
      })
      .limit(TRANSACTIONS_LIMIT);

    if (error) {
      console.error(
        "Explorer transactions query failed:",
        error,
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to load network transactions.",
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json(
      {
        success: true,
        transactions: data ?? [],
      },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=5, stale-while-revalidate=10",
        },
      },
    );
  } catch (error) {
    console.error(
      "Explorer transactions API error:",
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
