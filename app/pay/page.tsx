import {
  CheckCircle2,
  Clock3,
  CreditCard,
  ShieldCheck,
  Store,
  Zap,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/ui/Card";
import ProtectedPage from "@/components/auth/ProtectedPage";

import PaymentForm from "@/components/pay/PaymentForm";
import PaymentHistory from "@/components/pay/PaymentHistory";
import QRScanner from "@/components/pay/QRScanner";
import PaymentRequest from "@/components/pay/PaymentRequest";

const payStats = [
  {
    title: "Payment Speed",
    value: "Instant",
    description: "Real-time PLATON settlement",
    icon: Zap,
    iconStyle:
      "border-yellow-400/20 bg-yellow-400/10 text-yellow-300",
  },
  {
    title: "Network Fee",
    value: "0 π",
    description: "No additional transfer fees",
    icon: CreditCard,
    iconStyle:
      "border-emerald-400/20 bg-emerald-400/10 text-emerald-400",
  },
  {
    title: "Payment Status",
    value: "Active",
    description: "PLATON Pay is operational",
    icon: ShieldCheck,
    iconStyle:
      "border-cyan-400/20 bg-cyan-400/10 text-cyan-400",
  },
];

export default function PayPage() {
  return (
    <ProtectedPage>
      <main className="min-h-screen overflow-hidden bg-[#05070A] text-white">
        <Navbar />

        <section className="relative px-4 pb-24 pt-32 sm:px-6 lg:px-8">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute left-1/2 top-0 h-[650px] w-[1000px] -translate-x-1/2 rounded-full bg-cyan-500/[0.07] blur-[190px]" />

            <div className="absolute -left-52 top-[650px] h-[520px] w-[520px] rounded-full bg-yellow-500/[0.05] blur-[170px]" />

            <div className="absolute -right-52 top-[1050px] h-[520px] w-[520px] rounded-full bg-emerald-500/[0.05] blur-[170px]" />
          </div>

          <div className="relative mx-auto w-full max-w-[1500px]">
            <PageHeader
              badge="PLATON Pay"
              title="Pay with π"
              description="Send and receive fast, secure PLATON payments through the official network payment system."
            />

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {payStats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <article
                    key={stat.title}
                    className="group rounded-[28px] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.065]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${stat.iconStyle}`}
                      >
                        <Icon
                          size={21}
                          strokeWidth={2.2}
                        />
                      </div>

                      <span className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                        Live
                      </span>
                    </div>

                    <p className="mt-6 text-xs font-black uppercase tracking-[0.18em] text-white/30">
                      {stat.title}
                    </p>

                    <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-white">
                      {stat.value}
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-white/35">
                      {stat.description}
                    </p>
                  </article>
                );
              })}
            </div>

            <div className="mt-8 grid items-start gap-8 xl:grid-cols-[minmax(0,1.25fr)_420px]">
              <PaymentForm />

              <div className="space-y-8">
                <QRScanner />

                <Card>
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-400/10 text-violet-400">
                      <Store size={21} />
                    </div>

                    <div>
                      <p className="font-black text-white">
                        Merchant Payments
                      </p>

                      <p className="mt-1 text-sm text-white/35">
                        PLATON Pay merchant network
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4 rounded-[22px] border border-white/[0.07] bg-black/20 p-5">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm text-white/35">
                        Status
                      </span>

                      <span className="flex items-center gap-2 font-bold text-emerald-400">
                        <CheckCircle2 size={15} />

                        Active
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm text-white/35">
                        Confirmation
                      </span>

                      <span className="flex items-center gap-2 font-bold text-white">
                        <Clock3 size={15} />

                        Instant
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm text-white/35">
                        Network fee
                      </span>

                      <span className="font-bold text-yellow-300">
                        0 π
                      </span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            <div className="mt-8">
              <PaymentRequest />
            </div>

            <div className="mt-8">
              <PaymentHistory />
            </div>

            <div className="mt-10 rounded-[28px] border border-white/[0.07] bg-white/[0.025] px-6 py-5 backdrop-blur-xl">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />

                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                    </span>

                    <span className="text-sm text-white/40">
                      Payments operational
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-cyan-400" />

                    <span className="text-sm text-white/40">
                      Instant settlement
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-violet-400" />

                    <span className="text-sm text-white/40">
                      Payment requests active
                    </span>
                  </div>
                </div>

                <p className="text-sm font-semibold text-white/25">
                  Official PLATON Pay
                </p>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </ProtectedPage>
  );
}