"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { RoleGate } from "@/components/dashboard/context";
import { ConfirmDialog, Empty, ErrorBox, PageHeader, Spinner, StatusBadge, TableWrap, td, th } from "@/components/dashboard/ui";
import { apiFetch } from "@/lib/api";
import { useApi } from "@/lib/useApi";
import type { Application } from "@/lib/types";

function Content() {
  const { data, loading, error, reload } = useApi<Application[]>("/api/applications/my");
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function cancel() {
    if (!cancelId) return;
    setBusy(true);
    try { await apiFetch(`/api/applications/${cancelId}`, { method: "DELETE" }); toast.success("Application cancelled"); setCancelId(null); reload(); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Could not cancel"); }
    finally { setBusy(false); }
  }

  return (
    <>
      <PageHeader title="My applications" sub="Track every tuition you applied for." action={<Link href="/tuitions" className="btn btn-grape btn-sm">Find more tuitions</Link>} />
      {loading ? <Spinner /> : error ? <ErrorBox message={error} onRetry={reload} /> : !data?.length ? (
        <Empty title="No applications yet" text="You're one step closer to finding your mentor. Browse tuitions and apply." href="/tuitions" cta="Browse tuitions" />
      ) : (
        <TableWrap>
          <thead><tr className="border-b border-line"><th className={th}>Tuition</th><th className={th}>Tutor</th><th className={th}>Fee</th><th className={th}>Applied</th><th className={th}>Status</th><th className={th}></th></tr></thead>
          <tbody>
            {data.map((a) => (
              <tr key={a._id} className="border-b border-line last:border-0">
                <td className={td}><Link href={`/tuitions/${a.tuitionId}`} className="font-bold hover:underline">{a.tuitionTitle}</Link><p className="text-xs text-muted">{a.subject}</p></td>
                <td className={td}>{a.tutorName || "-"}</td>
                <td className={td}>৳{a.monthlyFee.toLocaleString("en-US")}</td>
                <td className={td}>{new Date(a.appliedAt).toLocaleDateString("en-GB")}</td>
                <td className={td}><StatusBadge value={a.status} /></td>
                <td className={td}>{a.status === "pending" && <button onClick={() => setCancelId(a._id)} className="font-bold text-red-500 hover:underline">Cancel</button>}</td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      )}
      <ConfirmDialog open={!!cancelId} title="Cancel this application?" text="The tutor will no longer see your application. You can apply again later." confirmLabel="Yes, cancel it" danger busy={busy} onConfirm={cancel} onCancel={() => setCancelId(null)} />
    </>
  );
}
export default function Page() { return <RoleGate roles={["student"]}><Content /></RoleGate>; }
