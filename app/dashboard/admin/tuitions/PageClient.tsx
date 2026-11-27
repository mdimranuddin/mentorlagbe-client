"use client";

import { useState } from "react";
import { toast } from "sonner";
import { RoleGate } from "@/components/dashboard/context";
import { ConfirmDialog, Empty, ErrorBox, PageHeader, Spinner, StatusBadge, TableWrap, td, th } from "@/components/dashboard/ui";
import { apiFetch } from "@/lib/api";
import { useApi } from "@/lib/useApi";
import type { Tuition } from "@/lib/types";

const TABS = [["", "All"], ["pending", "Pending"], ["approved", "Approved"], ["rejected", "Rejected"]] as const;

function Content() {
  const [tab, setTab] = useState("pending");
  const { data, loading, error, reload } = useApi<Tuition[]>(`/api/tuitions/admin/all${tab ? `?approvalStatus=${tab}` : ""}`);
  const [delId, setDelId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function decide(id: string, approvalStatus: "approved" | "rejected") {
    try { await apiFetch(`/api/tuitions/${id}/status`, { method: "PATCH", body: { approvalStatus } }); toast.success(`Tuition ${approvalStatus}`); reload(); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Could not update"); }
  }
  async function remove() {
    if (!delId) return;
    setBusy(true);
    try { await apiFetch(`/api/tuitions/${delId}`, { method: "DELETE" }); toast.success("Tuition deleted"); setDelId(null); reload(); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Could not delete"); }
    finally { setBusy(false); }
  }

  return (
    <>
      <PageHeader title="Manage tuitions" sub="Approve or reject tuition posts from tutors." />
      <div className="mb-5 flex flex-wrap gap-2" role="tablist">
        {TABS.map(([v, l]) => (
          <button key={l} role="tab" aria-selected={tab === v} onClick={() => setTab(v)}
            className={`rounded-full px-5 py-2 text-sm font-bold ${tab === v ? "bg-cta text-[color:var(--cta-ink)]" : "bg-surface ring-1 ring-line hover:ring-brand"}`}>{l}</button>
        ))}
      </div>
      {loading ? <Spinner /> : error ? <ErrorBox message={error} onRetry={reload} /> : !data?.length ? (
        <Empty title="Nothing here" text={tab === "pending" ? "No tuitions are waiting for approval. Nice work!" : "No tuitions match this filter."} />
      ) : (
        <TableWrap>
          <thead><tr className="border-b border-line"><th className={th}>Tuition</th><th className={th}>Tutor</th><th className={th}>Fee</th><th className={th}>Status</th><th className={th}>Actions</th></tr></thead>
          <tbody>
            {data.map((t) => (
              <tr key={t._id} className="border-b border-line last:border-0">
                <td className={td}><p className="font-bold">{t.title}</p><p className="text-xs text-muted">{t.subject} · {t.classLevel} · {t.mode}</p></td>
                <td className={td}>{t.tutorName}<p className="text-xs text-muted">{t.tutorEmail}</p></td>
                <td className={td}>৳{t.monthlyFee.toLocaleString("en-US")}</td>
                <td className={td}><StatusBadge value={t.approvalStatus} /></td>
                <td className={td}>
                  <div className="flex flex-wrap gap-2">
                    {t.approvalStatus !== "approved" && <button onClick={() => decide(t._id, "approved")} className="btn btn-lemon btn-sm">Approve</button>}
                    {t.approvalStatus !== "rejected" && <button onClick={() => decide(t._id, "rejected")} className="btn btn-ghost btn-sm">Reject</button>}
                    <button onClick={() => setDelId(t._id)} className="px-2 text-sm font-bold text-red-500 hover:underline">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      )}
      <ConfirmDialog open={!!delId} title="Delete this tuition?" text="This removes it for good." confirmLabel="Delete" danger busy={busy} onConfirm={remove} onCancel={() => setDelId(null)} />
    </>
  );
}
export default function Page() { return <RoleGate roles={["admin"]}><Content /></RoleGate>; }
