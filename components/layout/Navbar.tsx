"use client";

import Link from "next/link";
import {
  usePathname,
  useRouter,
} from "next/navigation";
import {
  Menu,
  X,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";

const links = [
  ["Home", "/"],
  ["Market", "/market"],
  ["Wallet", "/wallet"],
  ["Pay", "/pay"],
  ["Explorer", "/explorer"],
  ["Dashboard", "/dashboard"],
  ["Profile", "/profile"],
  ["Staking", "/staking"],
  ["Academy", "/academy"],
  ["Whitepaper", "/whitepaper"],
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen] =
    useState(false);

  const [email, setEmail] =
    useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      const { data } =
        await supabase.auth.getUser();

      setEmail(
        data.user?.email ?? null
      );
    }

    void loadUser();

    const {
      data: listener,
    } =
      supabase.auth.onAuthStateChange(
        (_event, session) => {
          setEmail(
            session?.user?.email ??
              null
          );
        }
      );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();

    setEmail(null);
    setOpen(false);

    router.push("/login");
    router.refresh();
  }

  return (
    <nav className="fixed left-1/2 top-5 z-50 w-[calc(100%-40px)] max-w-7xl -translate-x-1/2 rounded-3xl border border-white/10 bg-black/40 px-5 py-4 text-white shadow-[0_0_80px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
      <div className="flex items-center justify-between gap-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-700 text-2xl font-black text-black">
            π
          </div>

          <div>
            <p className="text-lg font-black leading-none">
              PLATON
            </p>

            <p className="text-[10px] uppercase tracking-[2px] text-gray-400">
              Official Network
            </p>
          </div>
        </Link>

        <div className="hidden min-w-0 items-center gap-1 text-sm text-gray-300 xl:flex">
          {links.map(
            ([label, href]) => (
              <Link
                key={href}
                href={href}
                className={`whitespace-nowrap rounded-2xl px-3 py-2 transition ${
                  pathname === href
                    ? "bg-emerald-400/15 text-emerald-300"
                    : "hover:bg-white/5 hover:text-white"
                }`}
              >
                {label}
              </Link>
            )
          )}
        </div>

        <div className="hidden shrink-0 items-center gap-3 md:flex">
          {email ? (
            <>
              <span className="max-w-[150px] truncate text-sm text-emerald-300">
                {email}
              </span>

              <button
                type="button"
                onClick={() => {
                  void handleLogout();
                }}
                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-gray-300 transition hover:text-white"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 px-5 py-3 text-sm font-bold text-black"
              >
                Create Wallet
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => {
            setOpen(
              (currentOpen) =>
                !currentOpen
            );
          }}
          className="rounded-2xl border border-white/10 bg-white/5 p-3 xl:hidden"
          aria-label={
            open
              ? "Close navigation menu"
              : "Open navigation menu"
          }
        >
          {open ? (
            <X size={22} />
          ) : (
            <Menu size={22} />
          )}
        </button>
      </div>

      {open && (
        <div className="mt-5 grid gap-2 border-t border-white/10 pt-5 xl:hidden">
          {links.map(
            ([label, href]) => (
              <Link
                key={href}
                href={href}
                onClick={() => {
                  setOpen(false);
                }}
                className={`rounded-2xl px-4 py-3 ${
                  pathname === href
                    ? "bg-emerald-400/15 text-emerald-300"
                    : "bg-white/5 text-gray-300"
                }`}
              >
                {label}
              </Link>
            )
          )}

          {email ? (
            <>
              <div className="rounded-2xl bg-white/5 px-4 py-3 text-emerald-300 md:hidden">
                {email}
              </div>

              <button
                type="button"
                onClick={() => {
                  void handleLogout();
                }}
                className="rounded-2xl bg-red-500/15 px-4 py-3 text-left font-bold text-red-300 md:hidden"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => {
                  setOpen(false);
                }}
                className="rounded-2xl bg-white/5 px-4 py-3 text-gray-300 md:hidden"
              >
                Login
              </Link>

              <Link
                href="/register"
                onClick={() => {
                  setOpen(false);
                }}
                className="rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 px-4 py-3 font-bold text-black md:hidden"
              >
                Create Wallet
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
