"use client";

import { toast } from "sonner";
import { RoleGate, useMe } from "@/components/dashboard/context";
import { Empty, ErrorBox, PageHeader, Spinner, StatusBadge, TableWrap, td, th } from "@/components/dashboard/ui";
import { apiFetch } from "@/lib/api";
import { useApi } from "@/lib/useApi";
import type { AppUser } from "@/lib/types";

const ROLES = ["student", "tutor", "admin"];

function Content() {
  const me = useMe();
  const { data, loading, error, reload } = useApi<AppUser[]>("/api/users");

  async function changeRole(id: string, role: string) {
    try { await apiFetch(`/api/users/${id}/role`, { method: "PATCH", body: { role } }); toast.success("Role updated"); reload(); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Could not change the role"); }
  }

  return (
    <>
      <PageHeader title="Manage users" sub="Change roles and see who is on Pro." />
      {loading ? <Spinner /> : error ? <ErrorBox message={error} onRetry={reload} /> : !data?.length ? <Empty title="No users yet" text="Users will show up here after they sign up." /> : (
        <TableWrap>
          <thead><tr className="border-b border-line"><th className={th}>User</th><th className={th}>Plan</th><th className={th}>Joined</th><th className={th}>Role</th></tr></thead>
          <tbody>
            {data.map((u) => (
              <tr key={u._id} className="border-b border-line last:border-0">
                <td className={td}><p className="font-bold">{u.name}{u.email === me.email && <span className="ml-2 text-xs text-muted">(you)</span>}</p><p className="text-xs text-muted">{u.email}</p></td>
                <td className={td}><StatusBadge value={u.plan ?? "free"} /></td>
                <td className={td}>{u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-GB") : "-"}</td>
                <td className={td}>
                  <select value={u.role} disabled={u.email === me.email} onChange={(e) => changeRole(u._id, e.target.value)} aria-label={`Role of ${u.name}`}
                    className="cursor-pointer rounded-xl bg-paper px-3 py-2 font-bold capitalize outline-none ring-1 ring-line focus:ring-2 focus:ring-brand disabled:cursor-not-allowed disabled:opacity-50">
                    {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      )}
    </>
  );
}
export default function Page() { return <RoleGate roles={["admin"]}><Content /></RoleGate>; }
