"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const UPDATE_INTERVAL_MS = 13 * 60 * 1000;
const PRICE_CHECK_INTERVAL_MS = 15 * 1000;

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds,
  ).padStart(2, "0")}`;
}

function calculateSecondsLeft(nextUpdateAt: number) {
  return Math.max(
    0,
    Math.ceil((nextUpdateAt - Date.now()) / 1000),
  );
}

export default function Countdown() {
  const [nextUpdateAt, setNextUpdateAt] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

  useEffect(() => {
    let active = true;

    async function loadNextUpdateTime() {
      const { data, error } = await supabase
        .from("market_price")
        .select("updated_at")
        .eq("id", 1)
        .single();

      if (!active) {
        return;
      }

      if (error || !data?.updated_at) {
        console.error("Unable to load market price time:", error);
        return;
      }

      const lastUpdateAt = new Date(data.updated_at).getTime();

      if (!Number.isFinite(lastUpdateAt)) {
        return;
      }

      const nextUpdate = lastUpdateAt + UPDATE_INTERVAL_MS;

      setNextUpdateAt(nextUpdate);
      setSecondsLeft(calculateSecondsLeft(nextUpdate));
    }

    loadNextUpdateTime();

    const priceCheckTimer = window.setInterval(
      loadNextUpdateTime,
      PRICE_CHECK_INTERVAL_MS,
    );

    return () => {
      active = false;
      window.clearInterval(priceCheckTimer);
    };
  }, []);

  useEffect(() => {
    if (nextUpdateAt === null) {
      return;
    }

    setSecondsLeft(calculateSecondsLeft(nextUpdateAt));

    const countdownTimer = window.setInterval(() => {
      setSecondsLeft(calculateSecondsLeft(nextUpdateAt));
    }, 1000);

    return () => window.clearInterval(countdownTimer);
  }, [nextUpdateAt]);

  return (
    <span className="text-4xl font-bold text-emerald-400">
      {secondsLeft === null ? "--:--" : formatTime(secondsLeft)}
    </span>
  );
}
