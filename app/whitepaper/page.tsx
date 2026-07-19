import {
  ArrowRight,
  BookOpen,
  Download,
  Globe2,
  Landmark,
  Network,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import PageHeader from "@/components/layout/PageHeader";

const sections = [
  {
    title: "Vision",
    text: "PLATON is a next-generation digital asset designed to operate through its own official ecosystem with transparent pricing and long-term sustainability.",
    icon: Sparkles,
    iconStyle:
      "border-emerald-400/20 bg-emerald-400/10 text-emerald-400",
  },
  {
    title: "Technology",
    text: "The PLATON ecosystem combines official market infrastructure, secure internal wallets, staking services and blockchain verification tools.",
    icon: Network,
    iconStyle:
      "border-cyan-400/20 bg-cyan-400/10 text-cyan-400",
  },
  {
    title: "Economy",
    text: "The network follows a controlled token economy with official price updates every 13 minutes, Treasury settlement and ecosystem growth.",
    icon: Landmark,
    iconStyle:
      "border-yellow-400/20 bg-yellow-400/10 text-yellow-300",
  },
  {
    title: "Security",
    text: "Server-side validation, protected wallet operations, database access controls and transparent transaction records support ecosystem integrity.",
    icon: ShieldCheck,
    iconStyle:
      "border-blue-400/20 bg-blue-400/10 text-blue-400",
  },
  {
    title: "Roadmap",
    text: "Future development includes network expansion, governance, merchant payment tools, AI integration and international adoption.",
    icon: Globe2,
    iconStyle:
      "border-violet-400/20 bg-violet-400/10 text-violet-400",
  },
  {
    title: "Documentation",
    text: "The official Whitepaper explains the current PLATON architecture, Tokenomics, Treasury model, risks and long-term development strategy.",
    icon: BookOpen,
    iconStyle:
      "border-rose-400/20 bg-rose-400/10 text-rose-400",
  },
];

export default function WhitepaperPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#05070A] text-white">
      <Navbar />

      <section className="relative px-4 pb-24 pt-32 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-[650px] w-[1000px] -translate-x-1/2 rounded-full bg-emerald-500/[0.06] blur-[190px]" />

          <div className="absolute -left-48 top-[650px] h-[500px] w-[500px] rounded-full bg-violet-500/[0.05] blur-[170px]" />

          <div className="absolute -right-48 top-[850px] h-[500px] w-[500px] rounded-full bg-cyan-500/[0.04] blur-[170px]" />
        </div>

        <div className="relative mx-auto w-full max-w-7xl">
          <PageHeader
            badge="Official Whitepaper"
            title="PLATON Whitepaper"
            description="Official documentation describing the PLATON ecosystem, market architecture, Treasury model, Tokenomics and long-term vision."
          />

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {sections.map((section) => {
              const Icon = section.icon;

              return (
                <article
                  key={section.title}
                  className="rounded-[30px] border border-white/[0.08] bg-white/[0.04] p-6 backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:border-white/15 hover:bg-white/[0.06] sm:p-8"
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${section.iconStyle}`}
                  >
                    <Icon size={21} strokeWidth={2.2} />
                  </div>

                  <h2 className="mt-6 text-2xl font-black tracking-[-0.03em] text-white">
                    {section.title}
                  </h2>

                  <p className="mt-4 text-sm leading-7 text-white/40 sm:text-base">
                    {section.text}
                  </p>
                </article>
              );
            })}
          </div>

          <div className="mt-8 rounded-[32px] border border-emerald-400/15 bg-emerald-400/[0.045] p-6 backdrop-blur-2xl sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-400">
                  Official document
                </p>

                <h2 className="mt-3 text-2xl font-black tracking-[-0.03em] text-white sm:text-3xl">
                  PLATON Whitepaper v0.2
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-white/40">
                  Download the complete English-language document covering
                  the current ecosystem, official market, Treasury,
                  staking, security, Tokenomics, roadmap and risk
                  disclosures.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href="/PLATON_Whitepaper.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-6 py-4 text-sm font-black text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                  View Whitepaper

                  <ArrowRight size={18} />
                </a>

                <a
                  href="/api/whitepaper/download"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-6 py-4 text-sm font-black text-black transition hover:bg-emerald-300"
                >
                  <Download size={18} />

                  Download PDF
                </a>
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-xs leading-6 text-white/25">
            The Whitepaper is provided for informational purposes and does
            not constitute financial, investment or legal advice.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
