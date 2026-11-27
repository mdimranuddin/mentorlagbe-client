"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { RoleGate } from "@/components/dashboard/context";
import { ConfirmDialog, Empty, ErrorBox, PageHeader, Spinner, StatusBadge, TableWrap, td, th } from "@/components/dashboard/ui";
import { apiFetch } from "@/lib/api";
import { useApi } from "@/lib/useApi";
import type { Tuition } from "@/lib/types";

function Content() {
  const { data, loading, error, reload } = useApi<Tuition[]>("/api/tuitions/mine/list");
  const [delId, setDelId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function toggle(id: string) {
    try { await apiFetch(`/api/tuitions/${id}/toggle`, { method: "PATCH" }); reload(); }
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
      <PageHeader title="My tuitions" sub="Manage the tuitions you posted." action={<Link href="/dashboard/tutor/post-tuition" className="btn btn-grape btn-sm">Post a tuition</Link>} />
      {loading ? <Spinner /> : error ? <ErrorBox message={error} onRetry={reload} /> : !data?.length ? (
        <Empty title="You haven't posted yet" text="Your next teaching opportunity is waiting! Post your first tuition." href="/dashboard/tutor/post-tuition" cta="Post a tuition" />
      ) : (
        <TableWrap>
          <thead><tr className="border-b border-line"><th className={th}>Tuition</th><th className={th}>Fee</th><th className={th}>Approval</th><th className={th}>Visibility</th><th className={th}>Actions</th></tr></thead>
          <tbody>
            {data.map((t) => (
              <tr key={t._id} className="border-b border-line last:border-0">
                <td className={td}><p className="font-bold">{t.title}</p><p className="text-xs text-muted">{t.subject} · {t.classLevel} · {t.mode}</p></td>
                <td className={td}>৳{t.monthlyFee.toLocaleString("en-US")}</td>
                <td className={td}><StatusBadge value={t.approvalStatus} /></td>
                <td className={td}>
                  <button onClick={() => toggle(t._id)} className="rounded-full" aria-label={t.isActive ? "Close this tuition" : "Reopen this tuition"}>
                    <StatusBadge value={t.isActive ? "active" : "closed"} />
                  </button>
                </td>
                <td className={td}>
                  <div className="flex gap-4 font-bold">
                    <Link href={`/dashboard/tutor/edit-tuition/${t._id}`} className="text-brand hover:underline">Edit</Link>
                    <button onClick={() => setDelId(t._id)} className="text-red-500 hover:underline">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      )}
      <p className="mt-3 text-sm text-muted">Tip: click Active or Closed to change whether students can apply.</p>
      <ConfirmDialog open={!!delId} title="Delete this tuition?" text="This cannot be undone. Students will no longer see it." confirmLabel="Delete" danger busy={busy} onConfirm={remove} onCancel={() => setDelId(null)} />
    </>
  );
}
export default function Page() { return <RoleGate roles={["tutor"]}><Content /></RoleGate>; }
