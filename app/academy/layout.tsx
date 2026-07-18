"use client";

import {
  type ReactNode,
  useEffect,
} from "react";
import { useRouter } from "next/navigation";

const ACADEMY_ROUTES = [
  "/academy/getting-started",
  "/academy/how-to-buy",
] as const;

type AcademyLayoutProps = {
  children: ReactNode;
};

export default function AcademyLayout({
  children,
}: AcademyLayoutProps) {
  const router = useRouter();

  useEffect(() => {
    for (
      const route of ACADEMY_ROUTES
    ) {
      router.prefetch(route);
    }
  }, [router]);

  return children;
}