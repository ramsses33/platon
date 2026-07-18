import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type StakingAction =
  | "SUMMARY"
  | "STAKE"
  | "UNSTAKE";

type StakingRequestBody = {
  action?: unknown;
  amount?: unknown;
  accessToken?: unknown;
};

export async function POST(request: Request) {
  try {
    const body =
      (await request.json()) as StakingRequestBody;

    const action =
      typeof body.action === "string"
        ? body.action.trim().toUpperCase()
        : "";

    const accessToken =
      typeof body.accessToken === "string"
        ? body.accessToken.trim()
        : "";

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

    if (
      action !== "SUMMARY" &&
      action !== "STAKE" &&
      action !== "UNSTAKE"
    ) {
      return NextResponse.json(
        {
          error: "Invalid staking action",
        },
        {
          status: 400,
        }
      );
    }

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    const supabaseAnonKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (
      !supabaseUrl ||
      !supabaseAnonKey
    ) {
      console.error(
        "Supabase environment variables are missing."
      );

      return NextResponse.json(
        {
          error: "Server configuration error",
        },
        {
          status: 500,
        }
      );
    }

    const supabase = createClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        global: {
          headers: {
            Authorization:
              `Bearer ${accessToken}`,
          },
        },
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );

    const {
      data: userData,
      error: userError,
    } = await supabase.auth.getUser();

    if (
      userError ||
      !userData.user
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

    if (action === "SUMMARY") {
      const {
        data,
        error,
      } = await supabase.rpc(
        "get_staking_summary"
      );

      if (error) {
        console.error(
          "Failed to load staking summary:",
          error
        );

        return NextResponse.json(
          {
            error: error.message,
          },
          {
            status: 400,
          }
        );
      }

      return NextResponse.json({
        success: true,
        data,
      });
    }

    const amount =
      Number(body.amount);

    if (
      !Number.isFinite(amount) ||
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

    const decimalPlaces =
      body.amount
        ?.toString()
        .split(".")[1]
        ?.length ?? 0;

    if (decimalPlaces > 8) {
      return NextResponse.json(
        {
          error:
            "Amount supports up to 8 decimal places",
        },
        {
          status: 400,
        }
      );
    }

    if (action === "STAKE") {
      const {
        data,
        error,
      } = await supabase.rpc(
        "stake_platon",
        {
          stake_amount: amount,
        }
      );

      if (error) {
        console.error(
          "PLATON stake failed:",
          error
        );

        return NextResponse.json(
          {
            error: error.message,
          },
          {
            status: 400,
          }
        );
      }

      return NextResponse.json({
        success: true,
        action: "STAKE",
        data,
      });
    }

    const {
      data,
      error,
    } = await supabase.rpc(
      "unstake_platon",
      {
        unstake_amount: amount,
      }
    );

    if (error) {
      console.error(
        "PLATON unstake failed:",
        error
      );

      return NextResponse.json(
        {
          error: error.message,
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json({
      success: true,
      action: "UNSTAKE",
      data,
    });
  } catch (error) {
    console.error(
      "Staking API error:",
      error
    );

    return NextResponse.json(
      {
        error: "Server error",
      },
      {
        status: 500,
      }
    );
  }
}