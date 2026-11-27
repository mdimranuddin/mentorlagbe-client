import Link from "next/link";
import { ArrowRight, Check, GraduationCap, Presentation } from "lucide-react";
import Reveal from "./Reveal";

const cards = [
  {
    icon: GraduationCap,
    title: "I'm a Student",
    points: ["Find a tutor by subject and class", "Explore approved tuition opportunities", "Apply and track your status"],
    cta: "Find Tuition", href: "/tuitions",
    surface: "bg-grape text-white", btn: "btn-lemon", check: "bg-white/20",
  },
  {
    icon: Presentation,
    title: "I'm a Tutor",
    points: ["Post your tuition in minutes", "Manage applicants in one place", "Grow your teaching opportunities"],
    cta: "Become a Tutor", href: "/sign-up?role=tutor",
    surface: "bg-lemon text-navy", btn: "btn-navy", check: "bg-navy/10",
  },
];

export default function AudienceCards() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <div className="grid gap-6 md:grid-cols-2">
        {cards.map((c, i) => (
          <Reveal key={c.title} delay={i * 120} className="h-full">
            <div className={`card flex h-full flex-col p-8 ${c.surface}`}>
              <div className="flex items-center gap-4">
                <span className="grid h-16 w-16 place-items-center rounded-3xl bg-white/90 text-navy jelly-3d">
                  <c.icon size={30} />
                </span>
                <h2 className="text-3xl font-extrabold">{c.title}</h2>
              </div>
              <ul className="mt-6 space-y-3 text-lg">
                {c.points.map((p) => (
                  <li key={p} className="flex items-center gap-3">
                    <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full ${c.check}`}><Check size={16} /></span>
                    {p}
                  </li>
                ))}
              </ul>
              <Link href={c.href} className={`btn ${c.btn} mt-8 self-start text-lg`}>
                {c.cta} <ArrowRight size={20} />
              </Link>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
