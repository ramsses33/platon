import type { LucideIcon } from "lucide-react";
import {
  ArrowUpRight,
  Coins,
  GraduationCap,
  LineChart,
  QrCode,
  Search,
  Wallet,
} from "lucide-react";
import Link from "next/link";

type EcosystemItem = {
  title: string;
  description: string;
  href: string;
  label: string;
  icon: LucideIcon;
  accent: string;
  glow: string;
};

const ecosystemItems: EcosystemItem[] = [
  {
    title: "Official Market",
    description:
      "Buy and sell π exclusively through the official PLATON market.",
    href: "/market",
    label: "Trade π",
    icon: LineChart,
    accent: "text-emerald-300",
    glow: "from-emerald-400/20 via-emerald-400/5 to-transparent",
  },
  {
    title: "PLATON Wallet",
    description:
      "Store, receive and transfer π from your secure network wallet.",
    href: "/wallet",
    label: "Open Wallet",
    icon: Wallet,
    accent: "text-cyan-300",
    glow: "from-cyan-400/20 via-cyan-400/5 to-transparent",
  },
  {
    title: "Staking",
    description:
      "Stake your π and earn network rewards directly inside the ecosystem.",
    href: "/staking",
    label: "Start Staking",
    icon: Coins,
    accent: "text-yellow-300",
    glow: "from-yellow-400/20 via-yellow-400/5 to-transparent",
  },
  {
    title: "PLATON Pay",
    description:
      "Create and scan QR payment requests for instant π transactions.",
    href: "/pay",
    label: "Make a Payment",
    icon: QrCode,
    accent: "text-violet-300",
    glow: "from-violet-400/20 via-violet-400/5 to-transparent",
  },
  {
    title: "Network Explorer",
    description:
      "Search blocks, transactions and wallet activity across the network.",
    href: "/explorer",
    label: "Explore Network",
    icon: Search,
    accent: "text-blue-300",
    glow: "from-blue-400/20 via-blue-400/5 to-transparent",
  },
  {
    title: "PLATON Academy",
    description:
      "Learn how the PLATON network, wallet, market and payments work.",
    href: "/academy",
    label: "Start Learning",
    icon: GraduationCap,
    accent: "text-orange-300",
    glow: "from-orange-400/20 via-orange-400/5 to-transparent",
  },
];

export default function EcosystemSection() {
  return (
    <section
      id="ecosystem"
      className="relative w-full overflow-hidden bg-[#05070A] px-4 py-16 text-white sm:px-6 sm:py-20 lg:px-8 lg:py-28"
    >
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/[0.06] blur-[140px]" />

      <div className="relative mx-auto w-full max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[3px] text-emerald-400 sm:text-sm sm:tracking-[5px]">
            Explore the Ecosystem
          </p>

          <h2 className="mt-4 text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
            One Network.
            <span className="block bg-gradient-to-r from-yellow-300 via-emerald-300 to-cyan-300 bg-clip-text text-transparent">
              Every PLATON Experience.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-gray-400 sm:text-base sm:leading-7">
            Trade, store, stake, pay, explore and learn
            inside one connected digital ecosystem built
            around PLATON π.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {ecosystemItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.title}
                href={item.href}
                className="group relative min-w-0 overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.07] sm:rounded-[30px] sm:p-7"
              >
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${item.glow} opacity-70 transition duration-300 group-hover:opacity-100`}
                />

                <div className="relative">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/30 sm:h-14 sm:w-14">
                      <Icon
                        className={item.accent}
                        size={26}
                        strokeWidth={1.8}
                      />
                    </div>

                    <ArrowUpRight
                      className="shrink-0 text-gray-600 transition duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-white"
                      size={22}
                    />
                  </div>

                  <h3 className="mt-7 text-xl font-black sm:text-2xl">
                    {item.title}
                  </h3>

                  <p className="mt-3 min-h-[72px] text-sm leading-6 text-gray-400 sm:text-base sm:leading-7">
                    {item.description}
                  </p>

                  <div className="mt-6 flex items-center gap-2 text-sm font-bold text-white">
                    <span>{item.label}</span>

                    <ArrowUpRight
                      size={16}
                      className="transition duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
