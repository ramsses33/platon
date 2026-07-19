import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  Coins,
  GraduationCap,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import PageHeader from "@/components/layout/PageHeader";

const lessons = [
  {
    title: "Getting Started",
    text: "Create your wallet and understand the PLATON ecosystem.",
    level: "Beginner",
    lesson: "Lesson 1",
    href: "/academy/getting-started",
    icon: GraduationCap,
    iconStyle:
      "border-emerald-400/20 bg-emerald-400/10 text-emerald-400",
    available: true,
  },
  {
    title: "How to Buy π",
    text: "Learn how to purchase PLATON through the official market.",
    level: "Beginner",
    lesson: "Lesson 2",
    href: "/academy/how-to-buy",
    icon: Coins,
    iconStyle:
      "border-yellow-400/20 bg-yellow-400/10 text-yellow-300",
    available: true,
  },
  {
    title: "Wallet Security",
    text: "Protect your account and securely manage your PLATON assets.",
    level: "Beginner",
    lesson: "Lesson 3",
    href: "/academy/wallet-security",
    icon: ShieldCheck,
    iconStyle:
      "border-cyan-400/20 bg-cyan-400/10 text-cyan-400",
    available: true,
  },
  {
    title: "Staking Guide",
    text: "Earn passive rewards by staking your PLATON.",
    level: "Intermediate",
    lesson: "Lesson 4",
    href: "/academy/staking-guide",
    icon: Sparkles,
    iconStyle:
      "border-violet-400/20 bg-violet-400/10 text-violet-400",
    available: true,
  },
  {
    title: "Blockchain Basics",
    text: "Understand blocks, transactions and validators.",
    level: "Intermediate",
    lesson: "Lesson 5",
    href: "/academy/blockchain-basics",
    icon: BookOpen,
    iconStyle:
      "border-blue-400/20 bg-blue-400/10 text-blue-400",
    available: true,
  },
  {
    title: "Advanced PLATON",
    text: "Learn governance, ecosystem tools and future utilities.",
    level: "Advanced",
    lesson: "Lesson 6",
    href: "/academy/advanced-platon",
    icon: BrainCircuit,
    iconStyle:
      "border-rose-400/20 bg-rose-400/10 text-rose-400",
    available: true,
  },
];

export default function AcademyPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#05070A] text-white">
      <Navbar />

      <section className="relative px-4 pb-24 pt-32 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-[650px] w-[1000px] -translate-x-1/2 rounded-full bg-emerald-500/[0.06] blur-[190px]" />

          <div className="absolute -left-52 top-[650px] h-[520px] w-[520px] rounded-full bg-violet-500/[0.05] blur-[170px]" />

          <div className="absolute -right-52 top-[850px] h-[520px] w-[520px] rounded-full bg-yellow-500/[0.04] blur-[170px]" />
        </div>

        <div className="relative mx-auto w-full max-w-[1400px]">
          <PageHeader
            badge="PLATON Academy"
            title="Learn Everything About π"
            description="Master the PLATON ecosystem from beginner to advanced."
          />

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {lessons.map((lesson) => {
              const Icon = lesson.icon;

              return (
                <article
                  key={lesson.title}
                  className="group flex min-h-[310px] flex-col rounded-[30px] border border-white/[0.08] bg-white/[0.04] p-6 backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:border-white/15 hover:bg-white/[0.06] sm:p-7"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${lesson.iconStyle}`}
                    >
                      <Icon size={21} strokeWidth={2.2} />
                    </div>

                    <div className="text-right">
                      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/25">
                        {lesson.lesson}
                      </p>

                      <p className="mt-1 text-xs font-bold text-white/40">
                        {lesson.level}
                      </p>
                    </div>
                  </div>

                  <h2 className="mt-7 text-2xl font-black tracking-[-0.03em] text-white">
                    {lesson.title}
                  </h2>

                  <p className="mt-4 flex-1 text-sm leading-7 text-white/40">
                    {lesson.text}
                  </p>

                  {lesson.available ? (
                    <a
                      href={lesson.href}
                      className="mt-7 flex items-center justify-between rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.08] px-5 py-4 text-sm font-black text-emerald-400 transition hover:border-emerald-400/35 hover:bg-emerald-400/15"
                    >
                      <span>Read Lesson</span>

                      <ArrowRight
                        size={18}
                        className="transition group-hover:translate-x-1"
                      />
                    </a>
                  ) : (
                    <div className="mt-7 flex items-center justify-between rounded-2xl border border-white/[0.07] bg-black/20 px-5 py-4 text-sm font-black text-white/25">
                      <span>Coming Soon</span>

                      <ArrowRight size={18} />
                    </div>
                  )}
                </article>
              );
            })}
          </div>

          <div className="mt-8 rounded-[28px] border border-white/[0.07] bg-white/[0.025] px-6 py-5 backdrop-blur-xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />

                <p className="text-sm text-white/40">
                  All 6 Academy lessons are now available
                </p>
              </div>

              <p className="text-sm font-semibold text-white/25">
                Official PLATON Academy
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
