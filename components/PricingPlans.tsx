"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, Loader2, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { useApi } from "@/lib/useApi";
import type { AppUser } from "@/lib/types";

const PLANS = [
  { role: "tutor", who: "Tutors", name: "Pro Tutor", price: 15, accent: "bg-lemon",
    rows: [["Tuition posts", "2 posts", "Unlimited"], ["Applicant management", true, true], ["Verified badge", false, true]] },
  { role: "student", who: "Students", name: "Pro Student", price: 10, accent: "bg-mint",
    rows: [["Browse and apply", true, true], ["Track application status", true, true], ["Priority booking", false, true]] },
] as const;

function Cell({ v }: { v: string | boolean }) {
  if (typeof v === "string") return <span className="font-bold">{v}</span>;
  return v ? <Check size={18} className="text-brand" aria-label="Included" /> : <X size={18} className="text-muted" aria-label="Not included" />;
}

export default function PricingPlans() {
  const { data: session } = authClient.useSession();
  const { data: me } = useApi<AppUser>(session ? "/api/users/me" : null);
  const [busy, setBusy] = useState<string | null>(null);

  async function subscribe(role: string) {
    setBusy(role);
    try {
      const res = await fetch("/api/checkout_sessions", { method: "POST" });
      const json = await res.json();
      if (!res.ok || !json.url) throw new Error(json.error ?? "Could not start checkout");
      window.location.assign(json.url);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not start checkout");
      setBusy(null);
    }
  }

  function action(role: string, price: number) {
    if (!session) return <Link href={`/sign-up?role=${role}`} className="btn btn-grape w-full">Sign up to subscribe</Link>;
    if (!me) return <button disabled className="btn btn-grape w-full opacity-60">Loading...</button>;
    if (me.role === "admin") return <p className="text-center text-sm text-muted">Admins don&apos;t need a plan.</p>;
    if (me.role !== role) return <p className="rounded-2xl bg-paper p-3 text-center text-sm font-semibold text-muted">This plan is for {role}s. You&apos;re signed in as a {me.role}.</p>;
    if (me.plan === "pro") return <p className="rounded-2xl bg-paper p-3 text-center font-bold text-brand">You&apos;re on Pro. Thank you!</p>;
    return (
      <button onClick={() => subscribe(role)} disabled={busy === role} className="btn btn-grape w-full disabled:opacity-60">
        {busy === role ? <><Loader2 className="animate-spin" size={18} /> Redirecting...</> : `Subscribe with Stripe · $${price}/mo`}
      </button>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {PLANS.map((p) => (
        <div key={p.role} className="card flex h-full flex-col p-7 hover:!translate-y-0">
          <h2 className="text-2xl font-extrabold">For {p.who}</h2>
          <div className={`jelly-3d mt-4 rounded-2xl p-5 text-navy ${p.accent}`}>
            <p className="flex items-center gap-2 font-bold"><Sparkles size={18} /> {p.name}</p>
            <p className="mt-1 font-display text-5xl font-extrabold">${p.price}<span className="text-lg font-semibold">/month</span></p>
          </div>
          <table className="mt-5 w-full text-sm">
            <thead><tr className="text-left text-xs font-extrabold uppercase text-muted"><th className="pb-2">Feature</th><th className="pb-2">Free</th><th className="pb-2">Pro</th></tr></thead>
            <tbody>
              {p.rows.map(([label, free, pro]) => (
                <tr key={label} className="border-t border-line"><td className="py-3 pr-2">{label}</td><td className="py-3"><Cell v={free} /></td><td className="py-3"><Cell v={pro} /></td></tr>
              ))}
            </tbody>
          </table>
          <div className="mt-auto pt-6">{action(p.role, p.price)}</div>
        </div>
      ))}
    </div>
  );
}
