"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMe } from "@/components/dashboard/context";
import { Spinner } from "@/components/dashboard/ui";

// /dashboard sends every user to their own dashboard: /dashboard/student, /tutor or /admin
export default function DashboardIndex() {
  const me = useMe();
  const router = useRouter();
  useEffect(() => { router.replace(`/dashboard/${me.role}`); }, [me.role, router]);
  return <Spinner label="Taking you to your dashboard..." />;
}
