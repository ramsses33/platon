import OrdersManager from "@/components/admin/orders/OrdersManager";
import PageHeader from "@/components/layout/PageHeader";

export default function OrdersPage() {
  return (
    <>
      <PageHeader
        badge="Administration"
        title="Orders Manager"
        description="Monitor and manage all exchange orders."
      />

      <div className="mt-8">
        <OrdersManager />
      </div>
    </>
  );
}