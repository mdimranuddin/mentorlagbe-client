import Link from "next/link";
import { Atom, Calculator, Code, Dna, FlaskConical, Globe, Languages, Monitor } from "lucide-react";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

const subjects = [
  { name: "Math", icon: Calculator, bg: "bg-lemon text-navy" },
  { name: "English", icon: Languages, bg: "bg-sky text-navy" },
  { name: "Physics", icon: Atom, bg: "bg-bubblegum text-navy" },
  { name: "Chemistry", icon: FlaskConical, bg: "bg-mint text-navy" },
  { name: "Biology", icon: Dna, bg: "bg-[#ffd9c2] text-navy" },
  { name: "Programming", icon: Code, bg: "bg-grape text-white" },
  { name: "IELTS", icon: Globe, bg: "bg-lilac" },
  { name: "ICT", icon: Monitor, bg: "bg-lemon text-navy" },
];

export default function PopularSubjects() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <SectionHeading title="Popular subjects" sub="Pick a subject and see approved tutors right away." />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {subjects.map((s, i) => (
          <Reveal key={s.name} delay={i * 50} className="h-full">
            <Link href={`/tuitions?subject=${encodeURIComponent(s.name)}`} className={`card jelly-3d flex h-full flex-col items-center gap-3 p-6 text-center ${s.bg}`}>
              <s.icon size={34} />
              <span className="font-display text-lg font-bold">{s.name}</span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
