import Link from "next/link";
import { Suspense } from "react";
import TuitionCard from "@/components/TuitionCard";
import TuitionFilters from "@/components/TuitionFilters";
import type { Tuition } from "@/lib/types";

export const metadata = { title: "Browse Tuitions – MentorLagbe" };
const LIMIT = 9;

type SP = Promise<Record<string, string | undefined>>;

async function Results({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const q = new URLSearchParams({ limit: String(LIMIT), page: sp.page ?? "1" });
  for (const k of ["search", "subject", "classLevel", "mode", "sort"]) if (sp[k]) q.set(k, sp[k]!);

  let data: { tuitions: Tuition[]; total: number; page: number; totalPages: number } | null = null;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tuitions?${q}`, { cache: "no-store" });
    if (res.ok) data = await res.json();
  } catch {}

  if (!data) {
    return (
      <div className="card p-10 text-center">
        <p className="font-display text-2xl font-bold">We couldn&apos;t load tuitions</p>
        <p className="mt-2 text-muted">Please check your connection and refresh the page.</p>
      </div>
    );
  }
  if (data.tuitions.length === 0) {
    return (
      <div className="card p-12 text-center">
        <p className="font-display text-3xl font-bold">Oops! No tuition found.</p>
        <p className="mt-2 text-muted">Let&apos;s try another search!</p>
        <Link href="/tuitions" className="btn btn-grape mt-6">Clear filters</Link>
      </div>
    );
  }

  const link = (p: number) => { const n = new URLSearchParams(q); n.set("page", String(p)); n.delete("limit"); return `/tuitions?${n}`; };
  const pages = Array.from({ length: data.totalPages }, (_, i) => i + 1);

  return (
    <>
      <p className="mb-4 font-semibold text-muted">
        Showing {(data.page - 1) * LIMIT + 1}-{(data.page - 1) * LIMIT + data.tuitions.length} of {data.total} tuitions
      </p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.tuitions.map((t) => <TuitionCard key={t._id} t={t} />)}
      </div>
      {data.totalPages > 1 && (
        <nav aria-label="Pagination" className="mt-10 flex flex-wrap items-center justify-center gap-2">
          {data.page > 1 && <Link href={link(data.page - 1)} className="btn btn-ghost btn-sm">Previous</Link>}
          {pages.map((p) => (
            <Link key={p} href={link(p)} aria-current={p === data.page ? "page" : undefined}
              className={`grid h-10 w-10 place-items-center rounded-full font-bold ${p === data.page ? "bg-cta text-[color:var(--cta-ink)]" : "bg-surface ring-1 ring-line hover:ring-brand"}`}>
              {p}
            </Link>
          ))}
          {data.page < data.totalPages && <Link href={link(data.page + 1)} className="btn btn-ghost btn-sm">Next</Link>}
        </nav>
      )}
    </>
  );
}

function Skeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true">
      {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-[27rem] animate-pulse rounded-3xl bg-surface/70" />)}
    </div>
  );
}

export default function TuitionsPage({ searchParams }: { searchParams: SP }) {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-4xl font-extrabold sm:text-5xl">Browse tuitions</h1>
      <p className="mt-3 max-w-2xl text-lg text-muted">Every tuition here is approved by our team. Filter by subject, class and mode.</p>
      <div className="mt-8"><Suspense><TuitionFilters /></Suspense></div>
      <div className="mt-8"><Suspense fallback={<Skeleton />}><Results searchParams={searchParams} /></Suspense></div>
    </div>
  );
}
