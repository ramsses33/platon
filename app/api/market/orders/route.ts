import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type PlaceOrderBody = {
  orderType?: "BUY" | "SELL";
  price?: number;
  amount?: number;
};

export async function POST(request: Request) {
  try {
    const authorization = request.headers.get("authorization");

    if (!authorization?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const accessToken = authorization.replace("Bearer ", "").trim();
    const body = (await request.json()) as PlaceOrderBody;

    const orderType = body.orderType?.toUpperCase();
    const price = Number(body.price);
    const amount = Number(body.amount);

    if (orderType !== "BUY" && orderType !== "SELL") {
      return NextResponse.json(
        { error: "Invalid order type" },
        { status: 400 }
      );
    }

    if (!Number.isFinite(price) || price <= 0) {
      return NextResponse.json(
        { error: "Price must be greater than zero" },
        { status: 400 }
      );
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        { error: "Amount must be greater than zero" },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !anonKey || !serviceRoleKey) {
      return NextResponse.json(
        { error: "Server configuration is incomplete" },
        { status: 500 }
      );
    }

    // Клиент пользователя: нужен для auth.uid() внутри place_order.
    const userClient = createClient(supabaseUrl, anonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const { data: userData, error: userError } =
      await userClient.auth.getUser(accessToken);

    if (userError || !userData.user) {
      return NextResponse.json(
        { error: "Invalid or expired session" },
        { status: 401 }
      );
    }

    const { data: orderId, error: orderError } =
      await userClient.rpc("place_order", {
        requested_type: orderType,
        requested_price: price,
        requested_amount: amount,
      });

    if (orderError || !orderId) {
      return NextResponse.json(
        { error: orderError?.message || "Order could not be created" },
        { status: 400 }
      );
    }

    // Серверный клиент: может запускать закрытые функции исполнения.
    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const { data: userMatch, error: userMatchError } =
      await adminClient.rpc("execute_user_match", {
        incoming_order_id: orderId,
      });

    if (userMatchError) {
      return NextResponse.json(
        {
          error: userMatchError.message,
          orderId,
        },
        { status: 500 }
      );
    }

    if (userMatch?.matched) {
      return NextResponse.json({
        success: true,
        orderId,
        executionSource: "USER",
        execution: userMatch,
      });
    }

    const { data: treasuryMatch, error: treasuryError } =
      await adminClient.rpc("execute_treasury_match", {
        incoming_order_id: orderId,
      });

    if (treasuryError) {
      return NextResponse.json(
        {
          error: treasuryError.message,
          orderId,
        },
        { status: 500 }
      );
    }

    if (treasuryMatch?.matched) {
      return NextResponse.json({
        success: true,
        orderId,
        executionSource: "TREASURY",
        execution: treasuryMatch,
      });
    }

    return NextResponse.json({
      success: true,
      orderId,
      executionSource: "NONE",
      message: "Order created and remains open.",
      userMatch,
      treasuryMatch,
    });
  } catch (error) {
    console.error("Market order API error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}