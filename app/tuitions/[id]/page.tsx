import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft, BadgeCheck, CalendarDays, GraduationCap, MapPin, Monitor, Wallet } from "lucide-react";
import ApplyPanel from "@/components/ApplyPanel";
import { SUBJECT_COLOR } from "@/lib/constants";
import type { Tuition } from "@/lib/types";

async function Details({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let t: Tuition | null = null;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tuitions/${id}`, { cache: "no-store" });
    if (res.ok) t = await res.json();
  } catch {}
  if (!t) notFound();

  const facts = [
    { icon: GraduationCap, label: "Class", value: t.classLevel },
    { icon: Monitor, label: "Mode", value: t.mode },
    { icon: MapPin, label: "Location", value: t.location || "Not set" },
    { icon: CalendarDays, label: "Schedule", value: `${t.daysPerWeek} days / week` },
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <Link href="/tuitions" className="inline-flex items-center gap-2 font-bold text-muted hover:text-ink"><ArrowLeft size={18} /> Back to tuitions</Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <div className="overflow-hidden rounded-[2rem] bg-lilac">
            {t.bannerImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={t.bannerImage} alt={`${t.subject} tuition banner`} className="aspect-video w-full object-cover" />
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-2 text-sm font-bold">
            <span className={`rounded-full px-4 py-1.5 ${SUBJECT_COLOR[t.subject] ?? "bg-lilac"}`}>{t.subject}</span>
            <span className={`rounded-full px-4 py-1.5 text-navy ${t.mode === "Online" ? "bg-sky" : "bg-mint"}`}>{t.mode}</span>
          </div>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight sm:text-5xl">{t.title}</h1>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {facts.map((f) => (
              <div key={f.label} className="card p-4 hover:!translate-y-0">
                <f.icon size={20} className="text-brand" />
                <p className="mt-2 text-xs font-bold text-muted">{f.label}</p>
                <p className="font-bold leading-snug">{f.value}</p>
              </div>
            ))}
          </div>

          <h2 className="mt-10 text-2xl font-extrabold">About this tuition</h2>
          <p className="mt-3 whitespace-pre-line text-lg leading-relaxed text-muted">{t.description}</p>

          <h2 className="mt-10 text-2xl font-extrabold">Your tutor</h2>
          <div className="card mt-4 flex items-start gap-4 p-5 hover:!translate-y-0">
            {t.tutor?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={t.tutor.image} alt="" className="h-16 w-16 rounded-full object-cover" />
            ) : (
              <span className="grid h-16 w-16 place-items-center rounded-full bg-lemon font-display text-xl font-extrabold text-navy">{t.tutorName[0]}</span>
            )}
            <div>
              <p className="flex items-center gap-2 text-lg font-extrabold">
                {t.tutor?.name ?? t.tutorName}
                {t.tutor?.verified && <span className="inline-flex items-center gap-1 rounded-full bg-lilac px-2.5 py-0.5 text-xs font-bold text-brand"><BadgeCheck size={14} /> Verified</span>}
              </p>
              <p className="mt-1 text-muted">{t.tutor?.bio || "This tutor has not added a bio yet."}</p>
            </div>
          </div>
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="card p-6 hover:!translate-y-0">
            <p className="flex items-center gap-2 text-sm font-bold text-muted"><Wallet size={16} /> Monthly fee</p>
            <p className="font-display text-4xl font-extrabold">৳{t.monthlyFee.toLocaleString("en-US")}</p>
            <div className="mt-5 border-t border-line pt-5">
              <ApplyPanel tuitionId={t._id} tuitionPath={`/tuitions/${t._id}`} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function TuitionDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div className="mx-auto h-[40rem] max-w-6xl animate-pulse px-6 py-10"><div className="h-full rounded-3xl bg-surface/70" /></div>}>
      <Details params={params} />
    </Suspense>
  );
}
