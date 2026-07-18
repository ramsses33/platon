import UsersManager from "@/components/admin/users/UsersManager";
import PageHeader from "@/components/layout/PageHeader";

export default function UsersPage() {
  return (
    <>
      <PageHeader
        badge="Administration"
        title="Users Manager"
        description="Monitor user wallets, balances and reserved funds."
      />

      <div className="mt-8">
        <UsersManager />
      </div>
    </>
  );
}