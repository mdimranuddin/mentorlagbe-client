"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useApi } from "@/lib/useApi";
import type { AppUser } from "@/lib/types";
import { MeContext } from "./context";
import DashboardFrame from "./DashboardFrame";
import { ErrorBox, Spinner } from "./ui";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();
  const { data: me, loading, error, reload } = useApi<AppUser>(session ? "/api/users/me" : null);

  // Give the session a moment to arrive before deciding the user is signed out.
  const [grace, setGrace] = useState(true);
  useEffect(() => { const t = setTimeout(() => setGrace(false), 1500); return () => clearTimeout(t); }, []);

  useEffect(() => {
    if (!isPending && !session && !grace) router.replace(`/sign-in?redirect=${encodeURIComponent(pathname)}`);
  }, [isPending, session, grace, router, pathname]);

  if (isPending || !session || (loading && !me)) return <div className="min-h-screen"><Spinner label="Opening your dashboard..." /></div>;
  if (error || !me) return <div className="mx-auto max-w-xl px-6 py-16"><ErrorBox message={error || "Could not load your account"} onRetry={reload} /></div>;

  return (
    <MeContext.Provider value={me}>
      <DashboardFrame me={me}>{children}</DashboardFrame>
    </MeContext.Provider>
  );
}
