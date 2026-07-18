import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type TransferType = "TRANSFER" | "PAYMENT";

type SendRequestBody = {
  receiverAddress?: unknown;
  amount?: unknown;
  accessToken?: unknown;
  transactionType?: unknown;
  note?: unknown;
};

export async function POST(request: Request) {
  try {
    const body =
      (await request.json()) as SendRequestBody;

    const receiverAddress =
      typeof body.receiverAddress === "string"
        ? body.receiverAddress.trim()
        : "";

    const accessToken =
      typeof body.accessToken === "string"
        ? body.accessToken.trim()
        : "";

    const amount = Number(body.amount);

    const transactionType: TransferType =
      body.transactionType === "PAYMENT"
        ? "PAYMENT"
        : "TRANSFER";

    const note =
      typeof body.note === "string"
        ? body.note.trim().slice(0, 120)
        : "";

    if (
      !receiverAddress ||
      !accessToken ||
      !Number.isFinite(amount)
    ) {
      return NextResponse.json(
        {
          error: "Missing or invalid required fields",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !receiverAddress.startsWith("platon_")
    ) {
      return NextResponse.json(
        {
          error: "Invalid PLATON wallet address",
        },
        {
          status: 400,
        }
      );
    }

    if (amount <= 0) {
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
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    const supabaseAnonKey =
      process.env
        .NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (
      !supabaseUrl ||
      !supabaseAnonKey
    ) {
      console.error(
        "Supabase environment variables are missing."
      );

      return NextResponse.json(
        {
          error:
            "Server configuration error",
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
            Authorization: `Bearer ${accessToken}`,
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

    if (
      transactionType === "PAYMENT"
    ) {
      const {
        data,
        error,
      } = await supabase.rpc(
        "send_platon_payment",
        {
          receiver_address:
            receiverAddress,
          send_amount: amount,
          payment_note: note,
        }
      );

      if (error) {
        console.error(
          "PLATON payment failed:",
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
        transactionType:
          "PAYMENT",
        data,
      });
    }

    const {
      data,
      error,
    } = await supabase.rpc(
      "send_platon",
      {
        receiver_address:
          receiverAddress,
        send_amount: amount,
      }
    );

    if (error) {
      console.error(
        "PLATON transfer failed:",
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
      transactionType:
        "TRANSFER",
      data,
    });
  } catch (error) {
    console.error(
      "Wallet send API error:",
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