import { Suspense } from "react";
import { Quote } from "lucide-react";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

async function getStats() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stats/public`, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as { tutors: number; students: number; tuitions: number; applications: number };
  } catch {
    return null;
  }
}

async function Stats() {
  const s = await getStats();
  const items = [
    { label: "Verified tutors", value: s?.tutors, bg: "bg-lemon" },
    { label: "Approved tuitions", value: s?.tuitions, bg: "bg-mint" },
    { label: "Students joined", value: s?.students, bg: "bg-sky" },
    { label: "Applications sent", value: s?.applications, bg: "bg-bubblegum" },
  ];
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {items.map((i) => (
        <div key={i.label} className={`jelly-3d rounded-3xl p-6 text-center text-navy ${i.bg}`}>
          <p className="font-display text-4xl font-extrabold">{i.value ?? "–"}</p>
          <p className="mt-1 font-semibold">{i.label}</p>
        </div>
      ))}
    </div>
  );
}

// Sample feedback for the demo site. Replace with real feedback when you have it.
const feedback = [
  { name: "Ayesha, Class 10", text: "I found a Math tutor in one evening and my application was accepted the next day." },
  { name: "Rafiq, Tutor", text: "Posting a tuition took five minutes. Managing applicants from one dashboard is so easy." },
  { name: "Tanzila, HSC", text: "The filters saved me so much time. Online and offline options are clear at a glance." },
];

export default function StatsAndTestimonials() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <SectionHeading title="Loved by learners and tutors" sub="Real numbers from the platform, and what people say." />
      <Suspense fallback={<div className="h-32 animate-pulse rounded-3xl bg-surface/70" />}>
        <Stats />
      </Suspense>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {feedback.map((f, i) => (
          <Reveal key={f.name} delay={i * 100} className="h-full">
            <figure className="card flex h-full flex-col p-6">
              <Quote className="text-brand" />
              <blockquote className="mt-3 flex-1 text-lg">{f.text}</blockquote>
              <figcaption className="mt-4 font-bold">{f.name}</figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
