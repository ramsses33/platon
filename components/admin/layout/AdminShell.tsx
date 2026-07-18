"use client";

import { ReactNode } from "react";
import AdminSidebar from "./AdminSidebar";

type AdminShellProps = {
  children: ReactNode;
};

export default function AdminShell({
  children,
}: AdminShellProps) {
  return (
    <div className="min-h-screen bg-[#05070A] text-white">
      <AdminSidebar />

      <main className="lg:ml-72">
        <div className="min-h-screen px-8 py-10">
          {children}
        </div>
      </main>
    </div>
  );
}