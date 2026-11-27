"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { GraduationCap, Loader2, Presentation } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import AuthShell from "./AuthShell";
import Field from "./Field";

const roles = [
  { id: "student", label: "I'm a Student", hint: "Find and apply for tuition", icon: GraduationCap },
  { id: "tutor", label: "I'm a Tutor", hint: "Post tuition and manage applicants", icon: Presentation },
] as const;

export default function SignUpForm() {
  const params = useSearchParams();
  const [role, setRole] = useState<"student" | "tutor">(params.get("role") === "tutor" ? "tutor" : "student");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  function validate() {
    const e: Record<string, string> = {};
    if (form.name.trim().length < 2) e.name = "Please enter your full name";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email address";
    if (form.password.length < 6) e.password = "Use at least 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const payload = { name: form.name.trim(), email: form.email.trim(), password: form.password, role };
    const { error } = await authClient.signUp.email(payload);
    if (error) { setLoading(false); toast.error(error.message ?? "Could not create your account"); return; }
    toast.success("Welcome to MentorLagbe! Your account is ready.");
    window.location.assign("/dashboard");
  }

  return (
    <AuthShell
      title="Create your account"
      sub="Join as a student or a tutor. It takes less than a minute."
      footer={<>Already have an account? <Link href="/sign-in" className="font-bold text-brand underline">Sign In</Link></>}
    >
      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        <fieldset>
          <legend className="mb-2 text-sm font-bold">I want to join as</legend>
          <div className="grid grid-cols-2 gap-3">
            {roles.map((r) => (
              <button type="button" key={r.id} onClick={() => setRole(r.id)} aria-pressed={role === r.id}
                className={`rounded-2xl p-4 text-left ring-2 transition ${role === r.id ? "bg-lilac ring-brand" : "bg-surface ring-line hover:ring-brand/50"}`}>
                <r.icon className="text-brand" />
                <span className="mt-2 block font-extrabold">{r.label}</span>
                <span className="text-xs text-muted">{r.hint}</span>
              </button>
            ))}
          </div>
        </fieldset>

        <Field label="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} autoComplete="name" placeholder="Your name" />
        <Field label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} error={errors.email} autoComplete="email" placeholder="you@example.com" />
        <Field label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} error={errors.password} autoComplete="new-password" placeholder="At least 6 characters" />

        <button type="submit" disabled={loading} className="btn btn-grape w-full text-lg disabled:opacity-60">
          {loading ? <><Loader2 className="animate-spin" size={20} /> Creating account...</> : "Create account"}
        </button>
      </form>
    </AuthShell>
  );
}
