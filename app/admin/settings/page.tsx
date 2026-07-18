import ExchangeSettings from "@/components/admin/settings/ExchangeSettings";
import PageHeader from "@/components/layout/PageHeader";

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        badge="Administration"
        title="Settings"
        description="Exchange configuration and platform settings."
      />

      <div className="mt-8">
        <ExchangeSettings />
      </div>
    </>
  );
}