"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import Field from "@/components/auth/Field";
import ImageUpload from "./ImageUpload";
import { CLASS_LEVELS, MODES, SUBJECTS } from "@/lib/constants";
import type { Tuition } from "@/lib/types";

export type TuitionValues = {
  title: string; subject: string; classLevel: string; mode: string; location: string;
  monthlyFee: string; daysPerWeek: string; description: string; bannerImage: string;
};

export const emptyTuition: TuitionValues = {
  title: "", subject: SUBJECTS[0], classLevel: CLASS_LEVELS[1], mode: "Online", location: "",
  monthlyFee: "", daysPerWeek: "3", description: "", bannerImage: "",
};

export function fromTuition(t: Tuition): TuitionValues {
  return { title: t.title, subject: t.subject, classLevel: t.classLevel, mode: t.mode, location: t.location ?? "",
    monthlyFee: String(t.monthlyFee), daysPerWeek: String(t.daysPerWeek), description: t.description, bannerImage: t.bannerImage ?? "" };
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-bold">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full cursor-pointer rounded-2xl bg-surface px-4 py-3.5 outline-none ring-1 ring-line focus:ring-2 focus:ring-brand">
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </label>
  );
}

export default function TuitionForm({ initial, submitLabel, onSubmit }: {
  initial: TuitionValues; submitLabel: string; onSubmit: (v: TuitionValues) => Promise<void>;
}) {
  const [v, setV] = useState(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const set = (k: keyof TuitionValues) => (val: string) => setV((s) => ({ ...s, [k]: val }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (v.title.trim().length < 5) err.title = "Title should be at least 5 characters";
    if (!(Number(v.monthlyFee) >= 0) || v.monthlyFee === "") err.monthlyFee = "Enter the monthly fee";
    const d = Number(v.daysPerWeek);
    if (!(d >= 1 && d <= 7)) err.daysPerWeek = "Choose 1 to 7 days";
    if (v.mode === "Offline" && !v.location.trim()) err.location = "Offline tuitions need a location";
    if (v.description.trim().length < 20) err.description = "Describe the tuition in at least 20 characters";
    setErrors(err);
    if (Object.keys(err).length) return;
    setLoading(true);
    try { await onSubmit(v); } finally { setLoading(false); }
  }

  return (
    <form onSubmit={submit} className="card space-y-5 p-6 hover:!translate-y-0 sm:p-8" noValidate>
      <Field label="Title" value={v.title} onChange={(e) => set("title")(e.target.value)} error={errors.title} placeholder="e.g. Class 9-10 Math Master Batch" />
      <div className="grid gap-5 sm:grid-cols-3">
        <Select label="Subject" value={v.subject} onChange={set("subject")} options={SUBJECTS} />
        <Select label="Class level" value={v.classLevel} onChange={set("classLevel")} options={CLASS_LEVELS} />
        <Select label="Mode" value={v.mode} onChange={set("mode")} options={MODES} />
      </div>
      <Field label="Location" value={v.location} onChange={(e) => set("location")(e.target.value)} error={errors.location} placeholder={v.mode === "Online" ? "e.g. Online (Zoom)" : "e.g. Dhanmondi, Dhaka"} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Monthly fee (৳)" type="number" min={0} value={v.monthlyFee} onChange={(e) => set("monthlyFee")(e.target.value)} error={errors.monthlyFee} placeholder="3000" />
        <Field label="Days per week" type="number" min={1} max={7} value={v.daysPerWeek} onChange={(e) => set("daysPerWeek")(e.target.value)} error={errors.daysPerWeek} />
      </div>
      <label className="block">
        <span className="mb-1.5 block text-sm font-bold">Description</span>
        <textarea rows={5} value={v.description} onChange={(e) => set("description")(e.target.value)} placeholder="What will students learn? How are classes run?"
          className={`w-full rounded-2xl bg-surface px-4 py-3 outline-none ring-1 focus:ring-2 focus:ring-brand ${errors.description ? "ring-red-500" : "ring-line"}`} />
        {errors.description && <span className="mt-1 block text-sm font-semibold text-red-500">{errors.description}</span>}
      </label>
      <ImageUpload value={v.bannerImage} onChange={set("bannerImage")} />
      <button type="submit" disabled={loading} className="btn btn-grape w-full text-lg disabled:opacity-60 sm:w-auto">
        {loading ? <><Loader2 className="animate-spin" size={20} /> Saving...</> : submitLabel}
      </button>
    </form>
  );
}
