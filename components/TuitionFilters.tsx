"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { CLASS_LEVELS, MODES, SUBJECTS } from "@/lib/constants";

const sorts = [
  { v: "newest", l: "Newest first" }, { v: "fee_asc", l: "Fee: low to high" }, { v: "fee_desc", l: "Fee: high to low" },
];

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { v: string; l: string }[] }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold text-muted">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full cursor-pointer rounded-2xl bg-paper px-3 py-3 font-semibold outline-none ring-1 ring-line focus:ring-2 focus:ring-brand">
        {options.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
    </label>
  );
}

export default function TuitionFilters() {
  const router = useRouter();
  const sp = useSearchParams();
  const [search, setSearch] = useState(sp.get("search") ?? "");

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(sp.toString());
    if (value) next.set(key, value); else next.delete(key);
    next.delete("page");
    router.replace(`/tuitions?${next.toString()}`, { scroll: false });
  }

  // debounce the search box
  useEffect(() => {
    const id = setTimeout(() => { if ((sp.get("search") ?? "") !== search.trim()) setParam("search", search.trim()); }, 450);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const any = ["search", "subject", "classLevel", "mode", "sort"].some((k) => sp.get(k));
  const opt = (arr: string[], all: string) => [{ v: "", l: all }, ...arr.map((x) => ({ v: x, l: x }))];

  return (
    <div className="card p-4 hover:!translate-y-0 sm:p-5">
      <div className="grid gap-3 md:grid-cols-[2fr_1fr_1fr_1fr_1fr]">
        <label className="block">
          <span className="mb-1 block text-xs font-bold text-muted">Search</span>
          <span className="flex items-center gap-2 rounded-2xl bg-paper px-3 ring-1 ring-line focus-within:ring-2 focus-within:ring-brand">
            <Search size={18} className="text-muted" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Title or subject"
              className="w-full bg-transparent py-3 font-semibold outline-none" />
          </span>
        </label>
        <Select label="Subject" value={sp.get("subject") ?? ""} onChange={(v) => setParam("subject", v)} options={opt(SUBJECTS, "All subjects")} />
        <Select label="Class" value={sp.get("classLevel") ?? ""} onChange={(v) => setParam("classLevel", v)} options={opt(CLASS_LEVELS, "All classes")} />
        <Select label="Mode" value={sp.get("mode") ?? ""} onChange={(v) => setParam("mode", v)} options={opt(MODES, "Online + Offline")} />
        <Select label="Sort by" value={sp.get("sort") ?? "newest"} onChange={(v) => setParam("sort", v === "newest" ? "" : v)} options={sorts} />
      </div>
      {any && (
        <button onClick={() => { setSearch(""); router.replace("/tuitions", { scroll: false }); }}
          className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-brand hover:underline">
          <X size={15} /> Clear all filters
        </button>
      )}
    </div>
  );
}
