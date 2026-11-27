"use client";

import { RoleGate } from "@/components/dashboard/context";
import Overview from "@/components/dashboard/Overview";

export default function Page() {
  return <RoleGate roles={["student"]}><Overview /></RoleGate>;
}
