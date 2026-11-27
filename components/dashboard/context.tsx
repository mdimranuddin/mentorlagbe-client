"use client";

import { createContext, useContext } from "react";
import type { AppUser } from "@/lib/types";
import { Empty } from "./ui";

export const MeContext = createContext<AppUser | null>(null);
export function useMe() {
  const me = useContext(MeContext);
  if (!me) throw new Error("useMe must be used inside the dashboard");
  return me;
}

// Friendly guard. The Express API enforces roles too, so this is only for a nicer screen.
export function RoleGate({ roles, children }: { roles: AppUser["role"][]; children: React.ReactNode }) {
  const me = useMe();
  if (!roles.includes(me.role))
    return <Empty title="This page is not for your account" text={`Only ${roles.join(" or ")} accounts can open this page.`} href="/dashboard" cta="Back to dashboard" />;
  return <>{children}</>;
}
