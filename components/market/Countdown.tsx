"use client";

import { useEffect, useState } from "react";

const UPDATE_INTERVAL = 13 * 60;

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function Countdown() {
  const [secondsLeft, setSecondsLeft] = useState(UPDATE_INTERVAL);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) return UPDATE_INTERVAL;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <span className="text-4xl font-bold text-emerald-400">
      {formatTime(secondsLeft)}
    </span>
  );
}