import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import PortfolioChart from "@/components/wallet/PortfolioChart";
import StatsCards from "@/components/dashboard/StatsCards";
import ActivityTable from "@/components/dashboard/ActivityTable";
import ProtectedPage from "@/components/auth/ProtectedPage";

export default function DashboardPage() {
  return (
    <ProtectedPage>
      <main className="min-h-screen bg-[#05070A] text-white">
        <Navbar />

        <section className="px-8 pt-32 pb-24">
          <div className="mx-auto max-w-7xl">
            <PageHeader
              badge="PLATON Dashboard"
              title="Your Network Overview"
              description="Monitor your portfolio, staking rewards and network performance in real time."
            />

            <StatsCards />

            <div className="mt-10 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
              <Card>
                <h2 className="mb-6 text-3xl font-black">
                  Portfolio Growth
                </h2>

                <PortfolioChart />
              </Card>

              <Card>
                <h2 className="mb-6 text-3xl font-black">
                  Quick Actions
                </h2>

                <div className="space-y-4">
                  <Button>Buy π</Button>
                  <Button variant="secondary">Send π</Button>
                  <Button variant="secondary">Stake π</Button>
                  <Button variant="gold">Explorer</Button>
                </div>
              </Card>
            </div>

            <div className="mt-10">
              <ActivityTable />
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </ProtectedPage>
  );
}