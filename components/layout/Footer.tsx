import Link from "next/link";

type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
};

type FooterColumn = {
  title: string;
  links: FooterLink[];
};

const columns: FooterColumn[] = [
  {
    title: "Platform",
    links: [
      {
        label: "Market",
        href: "/market",
      },
      {
        label: "Wallet",
        href: "/wallet",
      },
      {
        label: "PLATON Pay",
        href: "/pay",
      },
      {
        label: "Explorer",
        href: "/explorer",
      },
      {
        label: "Dashboard",
        href: "/dashboard",
      },
    ],
  },
  {
    title: "Network",
    links: [
      {
        label: "Staking",
        href: "/staking",
      },
      {
        label: "Tokenomics",
        href: "/#tokenomics",
      },
      {
        label: "Roadmap",
        href: "/#roadmap",
      },
      {
        label: "Whitepaper",
        href: "/whitepaper",
      },
    ],
  },
  {
    title: "Resources",
    links: [
      {
        label: "Academy",
        href: "/academy",
      },
      {
        label: "Profile",
        href: "/profile",
      },
      {
        label: "GitHub",
        href: "https://github.com/ramsses33/platon",
        external: true,
      },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#030405] px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.4fr_2fr]">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-3"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-700 text-2xl font-black text-black">
              π
            </div>

            <div>
              <h3 className="text-2xl font-black">
                PLATON
              </h3>

              <p className="text-xs uppercase tracking-[3px] text-gray-500">
                Official Network
              </p>
            </div>
          </Link>

          <p className="mt-6 max-w-md leading-7 text-gray-400">
            The official ecosystem for buying, storing, staking, paying and tracking PLATON π.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <span className="rounded-full border border-emerald-400/15 bg-emerald-400/[0.07] px-4 py-2 text-xs font-bold text-emerald-400">
              Official Market
            </span>

            <span className="rounded-full border border-cyan-400/15 bg-cyan-400/[0.07] px-4 py-2 text-xs font-bold text-cyan-400">
              PLATON Network
            </span>
          </div>
        </div>

        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
          {columns.map((column) => (
            <div key={column.title}>
              <h4 className="font-black text-white">
                {column.title}
              </h4>

              <div className="mt-5 flex flex-col items-start gap-3">
                {column.links.map((link) =>
                  link.external ? (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-gray-400 transition hover:text-emerald-300"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="text-sm text-gray-400 transition hover:text-emerald-300"
                    >
                      {link.label}
                    </Link>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-14 flex max-w-7xl flex-col gap-4 border-t border-white/10 pt-6 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © 2026 PLATON Network. All rights reserved.
        </p>

        <p>
          Buy and Sell π Only Here
        </p>
      </div>
    </footer>
  );
}
