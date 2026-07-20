import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BLOCKS_LIMIT = 5;

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
      .from("network_blocks")
      .select(
        `
          block_number,
          block_hash,
          previous_hash,
          validator,
          transaction_count,
          confirmed_at
        `,
      )
      .order("block_number", {
        ascending: false,
      })
      .limit(BLOCKS_LIMIT);

    if (error) {
      console.error(
        "Explorer blocks query failed:",
        error,
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to load network blocks.",
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json(
      {
        success: true,
        blocks: data ?? [],
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
      "Explorer blocks API error:",
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
