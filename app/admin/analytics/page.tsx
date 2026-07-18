import AnalyticsDashboard from "@/components/admin/analytics/AnalyticsDashboard";
import PageHeader from "@/components/layout/PageHeader";

export default function AnalyticsPage() {
  return (
    <>
      <PageHeader
        badge="Administration"
        title="Analytics"
        description="Exchange statistics and trading activity."
      />

      <div className="mt-8">
        <AnalyticsDashboard />
      </div>
    </>
  );
}