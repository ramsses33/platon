import TradesManager from "@/components/admin/trades/TradesManager";
import PageHeader from "@/components/layout/PageHeader";

export default function TradesPage() {
  return (
    <>
      <PageHeader
        badge="Administration"
        title="Trades Manager"
        description="Monitor all user and Treasury trade executions."
      />

      <div className="mt-8">
        <TradesManager />
      </div>
    </>
  );
}