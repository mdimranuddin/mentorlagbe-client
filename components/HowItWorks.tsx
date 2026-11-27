import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

const steps = [
  { n: "1", title: "Search", color: "bg-lemon", student: "Filter approved tuitions by subject, class and mode.", tutor: "Create your profile and pick your subjects." },
  { n: "2", title: "Apply", color: "bg-bubblegum", student: "Send your application with your preferred schedule.", tutor: "Post a tuition. Our team approves it before it goes live." },
  { n: "3", title: "Connect", color: "bg-mint", student: "Track your status until a tutor accepts you.", tutor: "Review applicants and accept the best match." },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-16">
      <SectionHeading title="How MentorLagbe works" sub="Three simple steps, whether you learn or teach." />
      <div className="grid gap-6 md:grid-cols-3">
        {steps.map((s, i) => (
          <Reveal key={s.n} delay={i * 120} className="h-full">
            <div className="card h-full p-7">
              <span className={`jelly-3d grid h-14 w-14 place-items-center rounded-full font-display text-2xl font-extrabold text-navy ${s.color}`}>{s.n}</span>
              <h3 className="mt-5 text-2xl font-extrabold">{s.title}</h3>
              <p className="mt-4 text-sm font-bold text-brand">Students</p>
              <p className="text-muted">{s.student}</p>
              <p className="mt-3 text-sm font-bold text-brand">Tutors</p>
              <p className="text-muted">{s.tutor}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
