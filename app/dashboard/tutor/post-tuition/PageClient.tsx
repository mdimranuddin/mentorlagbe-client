"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { RoleGate } from "@/components/dashboard/context";
import { PageHeader } from "@/components/dashboard/ui";
import TuitionForm, { emptyTuition } from "@/components/dashboard/TuitionForm";
import { apiFetch, ApiError } from "@/lib/api";

function Content() {
  const router = useRouter();
  return (
    <>
      <PageHeader title="Post a tuition" sub="Our team reviews every post before students can see it." />
      <TuitionForm initial={emptyTuition} submitLabel="Submit for approval" onSubmit={async (v) => {
        try {
          await apiFetch("/api/tuitions", { method: "POST", body: { ...v, monthlyFee: Number(v.monthlyFee), daysPerWeek: Number(v.daysPerWeek) } });
          toast.success("Tuition submitted! It will go live after approval.");
          router.push("/dashboard/tutor/my-tuitions");
        } catch (e) {
          if (e instanceof ApiError && e.code === "UPGRADE_REQUIRED")
            toast.error("Free plan allows 2 tuition posts. Level up with MentorLagbe Pro!", { action: { label: "Upgrade", onClick: () => router.push("/pricing") } });
          else toast.error(e instanceof Error ? e.message : "Could not post the tuition");
        }
      }} />
      <p className="mt-4 text-sm text-muted">Free plan: 2 posts. <Link href="/pricing" className="font-bold text-brand underline">Go Pro</Link> for unlimited posts.</p>
    </>
  );
}
export default function Page() { return <RoleGate roles={["tutor"]}><Content /></RoleGate>; }
