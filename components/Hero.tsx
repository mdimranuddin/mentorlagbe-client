"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import HeroCards from "./HeroCards";

const classLevels = ["Class 6-8", "Class 9-10", "Class 11-12", "Adult"];
const subjects = ["Math", "Physics", "Chemistry", "Biology", "English", "IELTS", "Programming", "ICT"];
const modes = ["Online", "Offline"];

function Field({ label, value, onChange, options, last }: {
  label: string; value: string; onChange: (v: string) => void; options: string[]; last?: boolean;
}) {
  return (
    <label className={`relative min-w-0 flex-1 px-3.5 py-1.5 ${last ? "" : "sm:border-r sm:border-line"}`}>
      <span className="block text-xs font-bold text-muted">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full cursor-pointer appearance-none truncate bg-transparent pr-6 text-[15px] font-bold text-ink outline-none"
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={16} className="pointer-events-none absolute bottom-3 right-3 text-muted" />
    </label>
  );
}

export default function Hero() {
  const router = useRouter();
  const [subject, setSubject] = useState("Math");
  const [classLevel, setClassLevel] = useState("Class 9-10");
  const [mode, setMode] = useState("Online");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/tuitions?${new URLSearchParams({ subject, classLevel, mode }).toString()}`);
  }

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -right-24 -top-32 h-[32rem] w-[32rem] rounded-full blur-[110px]" style={{ background: "var(--glow1)", opacity: "var(--glow-op)" }} />
        <div className="absolute -bottom-40 -left-32 h-[28rem] w-[28rem] rounded-full blur-[110px]" style={{ background: "var(--glow2)", opacity: "var(--glow-op)" }} />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-paper to-transparent" />
      </div>

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-6 pb-12 pt-12 lg:grid-cols-[1.3fr_1fr] lg:pt-16">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-surface px-4 py-1.5 text-sm font-semibold text-muted ring-1 ring-line">
            <span className="h-2 w-2 rounded-full bg-mint" /> Every tuition is approved by our team
          </span>
          <h1 className="mt-5 text-[clamp(2.6rem,6vw,4.75rem)] font-extrabold leading-[1.03]">
            Find Your Mentor. Unlock Your{" "}
            <span className="rounded-2xl bg-hl px-3 text-hl-ink [box-decoration-break:clone]">Potential.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted">
            Discover the best tuition opportunities or share your knowledge with students across Bangladesh.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 flex max-w-[44rem] flex-col gap-2 rounded-3xl bg-surface p-2.5 shadow-xl ring-1 ring-line lg:flex-row lg:items-center lg:rounded-full"
          >
            <div className="grid flex-1 gap-1 sm:grid-cols-3">
              <Field label="Subject" value={subject} onChange={setSubject} options={subjects} />
              <Field label="Class" value={classLevel} onChange={setClassLevel} options={classLevels} />
              <Field label="Mode" value={mode} onChange={setMode} options={modes} last />
            </div>
            <button type="submit" className="btn btn-grape w-full shrink-0 whitespace-nowrap lg:ml-1 lg:w-auto">
              <Search size={18} /> Find tutor
            </button>
          </form>

          <p className="mt-5 text-sm font-semibold text-muted">8 subjects · Online and offline · Free to start</p>
        </div>

        <HeroCards />
      </div>
    </section>
  );
}
