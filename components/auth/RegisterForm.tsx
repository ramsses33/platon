"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";

export default function RegisterForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleRegister() {
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setMessage("Account created. Check your email to confirm registration.");
    setLoading(false);
  }

  return (
    <>
      <div className="mt-8 space-y-4">
        <input
          placeholder="Full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 outline-none"
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 outline-none"
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 outline-none"
        />

        <Button onClick={handleRegister} disabled={loading} className="w-full">
          {loading ? "Creating..." : "Create Wallet"}
        </Button>

        {message && (
          <p className="rounded-2xl bg-white/5 p-4 text-sm text-emerald-300">
            {message}
          </p>
        )}
      </div>

      <p className="mt-6 text-sm text-gray-400">
        Already have an account?{" "}
        <Link href="/login" className="text-emerald-400">
          Login
        </Link>
      </p>
    </>
  );
}