import { ReactNode } from "react";
import ProtectedPage from "@/components/auth/ProtectedPage";
import AdminShell from "@/components/admin/layout/AdminShell";

type AdminLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({
  children,
}: AdminLayoutProps) {
  return (
    <ProtectedPage>
      <AdminShell>
        {children}
      </AdminShell>
    </ProtectedPage>
  );
}