"use client";

import { useState } from "react";
import { Zap } from "lucide-react";
import { toast } from "sonner";
import { RoleGate } from "@/components/dashboard/context";
import { Empty, ErrorBox, PageHeader, Spinner, StatusBadge, TableWrap, td, th } from "@/components/dashboard/ui";
import { apiFetch } from "@/lib/api";
import { useApi } from "@/lib/useApi";
import type { Application } from "@/lib/types";

function Content() {
  const { data, loading, error, reload } = useApi<Application[]>("/api/applications/tutor");
  const [busyId, setBusyId] = useState<string | null>(null);

  async function setStatus(id: string, status: "accepted" | "rejected") {
    setBusyId(id);
    try { await apiFetch(`/api/applications/${id}/status`, { method: "PATCH", body: { status } }); toast.success(`Application ${status}`); reload(); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Could not update"); }
    finally { setBusyId(null); }
  }

  return (
    <>
      <PageHeader title="Applicants" sub="Pro students appear first (priority booking)." />
      {loading ? <Spinner /> : error ? <ErrorBox message={error} onRetry={reload} /> : !data?.length ? (
        <Empty title="No applicants yet" text="When students apply to your tuitions, they will show up here." />
      ) : (
        <TableWrap>
          <thead><tr className="border-b border-line"><th className={th}>Student</th><th className={th}>Tuition</th><th className={th}>Schedule and note</th><th className={th}>Status</th><th className={th}>Action</th></tr></thead>
          <tbody>
            {data.map((a) => (
              <tr key={a._id} className="border-b border-line align-top last:border-0">
                <td className={td}>
                  <p className="flex items-center gap-1.5 font-bold">{a.studentName}{a.studentPlan === "pro" && <Zap size={14} className="text-brand" aria-label="Pro student" />}</p>
                  <p className="text-xs text-muted">{a.studentEmail}</p><p className="text-xs text-muted">{a.studentPhone}</p>
                </td>
                <td className={td}>{a.tuitionTitle}</td>
                <td className={td}><p>{a.preferredSchedule}</p>{a.studentNote && <p className="mt-1 text-xs text-muted">&ldquo;{a.studentNote}&rdquo;</p>}</td>
                <td className={td}><StatusBadge value={a.status} /></td>
                <td className={td}>
                  {a.status === "pending" ? (
                    <div className="flex gap-2">
                      <button disabled={busyId === a._id} onClick={() => setStatus(a._id, "accepted")} className="btn btn-lemon btn-sm disabled:opacity-60">Accept</button>
                      <button disabled={busyId === a._id} onClick={() => setStatus(a._id, "rejected")} className="btn btn-ghost btn-sm disabled:opacity-60">Reject</button>
                    </div>
                  ) : <span className="text-muted">Done</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      )}
    </>
  );
}
export default function Page() { return <RoleGate roles={["tutor"]}><Content /></RoleGate>; }
