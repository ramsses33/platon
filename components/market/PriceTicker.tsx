"use client";

import { useEffect, useState } from "react";

const START_PRICE = 0.1034;
const UPDATE_INTERVAL = 13 * 60 * 1000;

export default function PriceTicker() {
  const [price, setPrice] = useState(START_PRICE);

  useEffect(() => {
    const timer = setInterval(() => {
      setPrice((prev) => {
        const change = (Math.random() - 0.45) * 0.004;
        const next = Math.max(0.01, prev * (1 + change));
        return Number(next.toFixed(5));
      });
    }, UPDATE_INTERVAL);

    return () => clearInterval(timer);
  }, []);

  return (
    <h3 className="mt-2 text-4xl font-bold">
      ${price.toFixed(5)}
    </h3>
  );
}