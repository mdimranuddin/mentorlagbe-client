"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import AuthShell from "./AuthShell";
import Field from "./Field";

export default function SignInForm() {
  const params = useSearchParams();
  const { data: session } = authClient.useSession();
  const next = params.get("redirect");
  const target = next && next.startsWith("/") ? next : "/dashboard";

  // If you are already signed in (or the session arrives a moment later), go straight to the dashboard
  useEffect(() => { if (session) window.location.replace(target); }, [session, target]);
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const e: Record<string, string> = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email address";
    if (!form.password) e.password = "Enter your password";
    setErrors(e);
    if (Object.keys(e).length) return;

    setLoading(true);
    const { error } = await authClient.signIn.email({ email: form.email.trim(), password: form.password });
    if (error) { setLoading(false); toast.error(error.message ?? "Wrong email or password"); return; }
    toast.success("Welcome back!");
    window.location.assign(target);   // full page load, so the new session is always picked up
  }

  return (
    <AuthShell
      title="Welcome back"
      sub="Sign in to continue to your dashboard."
      footer={<>New to MentorLagbe? <Link href="/sign-up" className="font-bold text-brand underline">Create an account</Link></>}
    >
      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        <Field label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} error={errors.email} autoComplete="email" placeholder="you@example.com" />
        <Field label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} error={errors.password} autoComplete="current-password" placeholder="Your password" />
        <button type="submit" disabled={loading} className="btn btn-grape w-full text-lg disabled:opacity-60">
          {loading ? <><Loader2 className="animate-spin" size={20} /> Signing in...</> : "Sign In"}
        </button>
      </form>
    </AuthShell>
  );
}
