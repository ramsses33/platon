import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: currentPrice, error: readError } = await supabase
      .from("market_price")
      .select("price")
      .eq("id", 1)
      .single();

    if (readError || !currentPrice) {
      return NextResponse.json(
        { error: "Current price not found" },
        { status: 500 }
      );
    }

    const oldPrice = Number(currentPrice.price);

    // Временный алгоритм движения цены.
    // Позже спрос и предложение заменят случайное движение.
    const movement = (Math.random() - 0.48) * 0.01;
    const calculatedPrice = oldPrice * (1 + movement);
    const newPrice = Number(Math.max(0.01, calculatedPrice).toFixed(8));
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
        { error: updateError.message },
        { status: 500 }
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
        { error: historyError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      oldPrice,
      newPrice,
      updatedAt,
    });
  } catch {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}