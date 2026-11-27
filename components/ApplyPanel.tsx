"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { apiFetch, ApiError } from "@/lib/api";
import Field from "@/components/auth/Field";

export default function ApplyPanel({ tuitionId, tuitionPath }: { tuitionId: string; tuitionPath: string }) {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user as { role?: string } | undefined;
  const [form, setForm] = useState({ studentPhone: "", preferredSchedule: "", studentNote: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  if (isPending) return <div className="h-40 animate-pulse rounded-2xl bg-paper" />;

  if (!session)
    return (
      <div>
        <p className="font-bold">Sign in to apply for this tuition.</p>
        <Link href={`/sign-in?redirect=${encodeURIComponent(tuitionPath)}`} className="btn btn-grape mt-4 w-full">Sign In to Apply</Link>
        <p className="mt-3 text-center text-sm text-muted">New here? <Link href="/sign-up" className="font-bold text-brand underline">Create an account</Link></p>
      </div>
    );

  if (user?.role !== "student")
    return <p className="rounded-2xl bg-paper p-4 text-sm font-semibold text-muted">Only student accounts can apply for a tuition.</p>;

  if (sent)
    return (
      <div className="text-center">
        <CheckCircle2 className="mx-auto text-mint" size={48} />
        <p className="mt-3 font-display text-xl font-bold">Application sent! Fingers crossed!</p>
        <Link href="/dashboard/student/my-applications" className="btn btn-ghost mt-4 w-full">Track my applications</Link>
      </div>
    );

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const e: Record<string, string> = {};
    if (!/^[0-9+\-\s]{10,15}$/.test(form.studentPhone)) e.studentPhone = "Enter a valid phone number";
    if (form.preferredSchedule.trim().length < 3) e.preferredSchedule = "Tell the tutor when you are free";
    setErrors(e);
    if (Object.keys(e).length) return;
    setLoading(true);
    try {
      await apiFetch("/api/applications", { method: "POST", body: { tuitionId, ...form } });
      setSent(true);
      toast.success("Application sent! Fingers crossed!");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not send your application");
    } finally { setLoading(false); }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <Field label="Phone number" value={form.studentPhone} onChange={(e) => setForm({ ...form, studentPhone: e.target.value })} error={errors.studentPhone} placeholder="01XXXXXXXXX" inputMode="tel" />
      <Field label="Preferred schedule" value={form.preferredSchedule} onChange={(e) => setForm({ ...form, preferredSchedule: e.target.value })} error={errors.preferredSchedule} placeholder="e.g. Sat, Mon, Wed at 6 PM" />
      <label className="block">
        <span className="mb-1.5 block text-sm font-bold">Note to the tutor (optional)</span>
        <textarea rows={3} value={form.studentNote} onChange={(e) => setForm({ ...form, studentNote: e.target.value })}
          className="w-full rounded-2xl bg-surface px-4 py-3 outline-none ring-1 ring-line focus:ring-2 focus:ring-brand" placeholder="Tell the tutor about your goals" />
      </label>
      <button type="submit" disabled={loading} className="btn btn-grape w-full text-lg disabled:opacity-60">
        {loading ? <><Loader2 className="animate-spin" size={20} /> Sending...</> : "Apply Now"}
      </button>
    </form>
  );
}
