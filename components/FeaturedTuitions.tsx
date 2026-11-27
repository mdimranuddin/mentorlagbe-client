import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight } from "lucide-react";
import TuitionCard from "./TuitionCard";
import type { Tuition } from "@/lib/types";
import SectionHeading from "./SectionHeading";

async function getFeatured(): Promise<Tuition[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tuitions?limit=6&sort=newest`, { cache: "no-store" });
    if (!res.ok) return [];
    return (await res.json()).tuitions ?? [];
  } catch {
    return [];
  }
}

async function FeaturedGrid() {
  const list = await getFeatured();
  if (list.length === 0) {
    return (
      <div className="card p-10 text-center">
        <p className="font-display text-2xl font-bold">No tuitions yet</p>
        <p className="mt-2 text-muted">Your next teaching opportunity is waiting! Check back in a moment.</p>
      </div>
    );
  }
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {list.map((t) => <TuitionCard key={t._id} t={t} />)}
    </div>
  );
}

function GridSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true">
      {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-[24rem] animate-pulse rounded-[1.75rem] bg-surface/70" />)}
    </div>
  );
}

export default function FeaturedTuitions() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading title="Fresh tuitions, just posted" sub="The 6 newest tuitions approved by our team." />
        <Link href="/tuitions" className="btn btn-ghost mb-10">See all <ArrowRight size={18} /></Link>
      </div>
      <Suspense fallback={<GridSkeleton />}>
        <FeaturedGrid />
      </Suspense>
    </section>
  );
}
