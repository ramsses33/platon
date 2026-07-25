"use client";

import PlatonGlyph from "@/components/brand/PlatonGlyph";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  Bot,
  CandlestickChart,
  Coins,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Users,
  WalletCards,
} from "lucide-react";

const navigation = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Market",
    href: "/admin/market",
    icon: CandlestickChart,
  },
  {
    label: "Treasury",
    href: "/admin/treasury",
    icon: WalletCards,
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: BookOpen,
  },
  {
    label: "Trades",
    href: "/admin/trades",
    icon: Coins,
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    label: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    label: "Simulation",
    href: "/admin/simulation",
    icon: Bot,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-72 border-r border-white/10 bg-[#07090D]/95 p-6 backdrop-blur-2xl lg:block">
      <Link href="/" className="flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#C9A858]/30 bg-gradient-to-br from-[#211E17] via-[#0E0D0B] to-black shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_8px_24px_rgba(201,168,88,0.14)]">
          <PlatonGlyph className="h-9 w-9" />
        </div>

        <div>
          <p className="text-lg font-black">PLATON</p>
          <p className="text-xs uppercase tracking-[3px] text-gray-500">
            Admin
          </p>
        </div>
      </Link>

      <div className="mt-8 rounded-2xl border border-emerald-400/15 bg-emerald-400/10 p-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-emerald-400" size={20} />

          <div>
            <p className="text-sm font-bold text-emerald-300">
              Secure Session
            </p>
            <p className="text-xs text-gray-500">Administrator access</p>
          </div>
        </div>
      </div>

      <nav className="mt-8 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;

          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 font-semibold transition ${
                active
                  ? "bg-gradient-to-r from-emerald-400 to-cyan-400 text-black shadow-[0_0_30px_rgba(0,224,184,0.18)]"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <p className="text-xs uppercase tracking-[3px] text-gray-500">
          System Status
        </p>

        <div className="mt-3 flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
          <span className="text-sm font-bold text-emerald-300">
            All systems operational
          </span>
        </div>
      </div>
    </aside>
  );
}