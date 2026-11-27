"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import Field from "@/components/auth/Field";
import { useMe } from "@/components/dashboard/context";
import ImageUpload from "@/components/dashboard/ImageUpload";
import { PageHeader, StatusBadge } from "@/components/dashboard/ui";
import { apiFetch } from "@/lib/api";
import { authClient } from "@/lib/auth-client";

export default function ProfilePage() {
  const me = useMe();
  const [form, setForm] = useState({ name: me.name, phone: me.phone ?? "", bio: me.bio ?? "", image: me.image ?? "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (form.name.trim().length < 2) { setError("Please enter your name"); return; }
    setError(""); setLoading(true);
    try {
      await apiFetch("/api/users/me", { method: "PATCH", body: form });
      await authClient.updateUser({ name: form.name.trim(), image: form.image || undefined });  // refresh the navbar session
      toast.success("Profile updated");
    } catch (err) { toast.error(err instanceof Error ? err.message : "Could not save your profile"); }
    finally { setLoading(false); }
  }

  return (
    <>
      <PageHeader title="Your profile" sub="This is how tutors and students see you." />
      <form onSubmit={save} className="card max-w-2xl space-y-5 p-6 hover:!translate-y-0 sm:p-8" noValidate>
        <ImageUpload value={form.image} onChange={(url) => setForm({ ...form, image: url })} label="Profile photo" round />
        <Field label="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={error} />
        <label className="block">
          <span className="mb-1.5 block text-sm font-bold">Email</span>
          <input value={me.email} disabled className="w-full rounded-2xl bg-paper px-4 py-3.5 text-muted ring-1 ring-line" />
        </label>
        <Field label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="01XXXXXXXXX" inputMode="tel" />
        <label className="block">
          <span className="mb-1.5 block text-sm font-bold">Bio</span>
          <textarea rows={4} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Tell people about yourself"
            className="w-full rounded-2xl bg-surface px-4 py-3 outline-none ring-1 ring-line focus:ring-2 focus:ring-brand" />
        </label>
        <div className="flex items-center gap-3 text-sm"><span className="font-bold">Role:</span> <span className="capitalize">{me.role}</span> <StatusBadge value={me.plan ?? "free"} /></div>
        <button type="submit" disabled={loading} className="btn btn-grape disabled:opacity-60">
          {loading ? <><Loader2 className="animate-spin" size={18} /> Saving...</> : "Save changes"}
        </button>
      </form>
    </>
  );
}
