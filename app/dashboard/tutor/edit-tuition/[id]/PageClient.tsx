"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { RoleGate } from "@/components/dashboard/context";
import { Empty, ErrorBox, PageHeader, Spinner } from "@/components/dashboard/ui";
import TuitionForm, { fromTuition } from "@/components/dashboard/TuitionForm";
import { apiFetch } from "@/lib/api";
import { useApi } from "@/lib/useApi";
import type { Tuition } from "@/lib/types";

function Content({ id }: { id: string }) {
  const router = useRouter();
  const { data, loading, error, reload } = useApi<Tuition[]>("/api/tuitions/mine/list");
  const t = data?.find((x) => x._id === id);
  return (
    <>
      <PageHeader title="Edit tuition" sub="Update the details and save." />
      {loading ? <Spinner /> : error ? <ErrorBox message={error} onRetry={reload} /> : !t ? (
        <Empty title="Tuition not found" text="It may have been deleted, or it isn't yours." href="/dashboard/tutor/my-tuitions" cta="Back to my tuitions" />
      ) : (
        <TuitionForm initial={fromTuition(t)} submitLabel="Save changes" onSubmit={async (v) => {
          try {
            await apiFetch(`/api/tuitions/${id}`, { method: "PATCH", body: { ...v, monthlyFee: Number(v.monthlyFee), daysPerWeek: Number(v.daysPerWeek) } });
            toast.success("Tuition updated");
            router.push("/dashboard/tutor/my-tuitions");
          } catch (e) { toast.error(e instanceof Error ? e.message : "Could not update"); }
        }} />
      )}
    </>
  );
}
export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <RoleGate roles={["tutor"]}><Content id={id} /></RoleGate>;
}
