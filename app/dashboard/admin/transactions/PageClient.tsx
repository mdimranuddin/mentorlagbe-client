"use client";

import { RoleGate } from "@/components/dashboard/context";
import { Empty, ErrorBox, PageHeader, Spinner, TableWrap, td, th } from "@/components/dashboard/ui";
import { useApi } from "@/lib/useApi";

type Payment = { _id: string; userEmail: string; userName: string; userRole: string; planName: string; amount: number; currency: string; transactionId: string; paidAt: string };
type Data = { totalRevenue: number; payments: Payment[] };

function Content() {
  const { data, loading, error, reload } = useApi<Data>("/api/subscription/payments");

  const byPlan: Record<string, number> = {};
  data?.payments.forEach((p) => { byPlan[p.planName] = (byPlan[p.planName] ?? 0) + p.amount; });
  const max = Math.max(1, ...Object.values(byPlan));

  return (
    <>
      <PageHeader title="Stripe revenue" sub="Every Pro subscription payment, in one place." />
      {loading ? <Spinner /> : error ? <ErrorBox message={error} onRetry={reload} /> : (
        <>
          <div className="grid gap-4 md:grid-cols-[1fr_1.6fr]">
            <div className="jelly-3d rounded-3xl bg-grape p-6 text-white">
              <p className="font-semibold">Total revenue</p>
              <p className="mt-2 font-display text-5xl font-extrabold">${(data?.totalRevenue ?? 0).toLocaleString("en-US")}</p>
              <p className="mt-1 text-sm text-white/80">{data?.payments.length ?? 0} payments</p>
            </div>
            <div className="card p-6 hover:!translate-y-0">
              <p className="font-bold">Revenue by plan</p>
              {Object.keys(byPlan).length === 0 ? <p className="mt-3 text-muted">No payments yet.</p> : (
                <div className="mt-4 space-y-3">
                  {Object.entries(byPlan).map(([plan, amt]) => (
                    <div key={plan}>
                      <div className="mb-1 flex justify-between text-sm font-bold"><span>{plan}</span><span>${amt}</span></div>
                      <div className="h-3 rounded-full bg-paper"><div className="h-3 rounded-full bg-brand" style={{ width: `${(amt / max) * 100}%` }} /></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <h2 className="mb-4 mt-10 text-2xl font-extrabold">Transactions</h2>
          {!data?.payments.length ? <Empty title="No payments yet" text="When a tutor or student upgrades to Pro, the payment appears here." /> : (
            <TableWrap>
              <thead><tr className="border-b border-line"><th className={th}>User</th><th className={th}>Plan</th><th className={th}>Amount</th><th className={th}>Transaction</th><th className={th}>Date</th></tr></thead>
              <tbody>
                {data.payments.map((p) => (
                  <tr key={p._id} className="border-b border-line last:border-0">
                    <td className={td}><p className="font-bold">{p.userName}</p><p className="text-xs text-muted">{p.userEmail} · {p.userRole}</p></td>
                    <td className={td}>{p.planName}</td>
                    <td className={td}>${p.amount} {p.currency?.toUpperCase()}</td>
                    <td className={`${td} max-w-[12rem] truncate font-mono text-xs`} title={p.transactionId}>{p.transactionId}</td>
                    <td className={td}>{new Date(p.paidAt).toLocaleDateString("en-GB")}</td>
                  </tr>
                ))}
              </tbody>
            </TableWrap>
          )}
        </>
      )}
    </>
  );
}
export default function Page() { return <RoleGate roles={["admin"]}><Content /></RoleGate>; }
