import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function StakingPage() {
  return (
    <main className="min-h-screen bg-[#05070A] text-white">
      <Navbar />

      <section className="px-8 pt-32 pb-24">
        <div className="mx-auto max-w-7xl">

          <PageHeader
            badge="PLATON Staking"
            title="Earn Rewards with π"
            description="Stake your PLATON and earn passive rewards while supporting the official network."
          />

          <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">

            <Card>
              <p className="text-gray-400">Estimated APR</p>

              <h2 className="mt-4 text-6xl font-black text-emerald-400">
                8.4%
              </h2>

              <p className="mt-5 text-gray-400">
                Rewards are calculated daily and distributed automatically.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-black/30 p-5">
                  <p className="text-sm text-gray-500">Staked</p>
                  <h3 className="mt-2 text-2xl font-bold">
                    84,200 π
                  </h3>
                </div>

                <div className="rounded-2xl bg-black/30 p-5">
                  <p className="text-sm text-gray-500">Rewards</p>
                  <h3 className="mt-2 text-2xl font-bold text-emerald-400">
                    +2,481 π
                  </h3>
                </div>
              </div>

              <div className="mt-8">
                <Button>Stake π Now</Button>
              </div>
            </Card>

            <Card>
              <h2 className="text-3xl font-black">
                Staking Calculator
              </h2>

              <input
                placeholder="Amount of π"
                className="mt-6 w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 text-2xl font-bold outline-none"
              />

              <div className="mt-6 rounded-2xl bg-black/30 p-5">
                <div className="flex justify-between">
                  <span className="text-gray-400">
                    Monthly Reward
                  </span>

                  <span className="text-emerald-400 font-bold">
                    +840 π
                  </span>
                </div>

                <div className="mt-4 flex justify-between">
                  <span className="text-gray-400">
                    Yearly Reward
                  </span>

                  <span className="text-emerald-400 font-bold">
                    +10,080 π
                  </span>
                </div>
              </div>

              <div className="mt-8">
                <Button variant="secondary">
                  Estimate Earnings
                </Button>
              </div>

            </Card>

          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}