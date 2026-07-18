import PageHeader from "@/components/layout/PageHeader";
import SystemOverview from "@/components/admin/dashboard/SystemOverview";
import MarketControl from "@/components/admin/market/MarketControl";
import Card from "@/components/ui/Card";
import TreasuryControl from "@/components/admin/treasury/TreasuryControl";

export default function AdminPage() {
  return (
    <>
      <PageHeader
        badge="PLATON Administration"
        title="Admin Control Center"
        description="Manage market settings, treasury reserves, users, orders, trades and platform security."
      />

      <SystemOverview />

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <MarketControl />

        <TreasuryControl />
      </div>
    </>
  );
}