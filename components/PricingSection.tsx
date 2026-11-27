import Link from "next/link";
import { Check, X, Sparkles } from "lucide-react";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

const plans = [
  {
    who: "Tutors", price: 15, accent: "bg-lemon",
    free: [["2 tuition posts", true], ["Applicant management", true], ["Verified badge", false]],
    pro: ["Unlimited tuition posts", "Verified badge on your profile", "Applicant management"],
  },
  {
    who: "Students", price: 10, accent: "bg-mint",
    free: [["Browse and apply", true], ["Track application status", true], ["Priority booking", false]],
    pro: ["Priority booking: tutors see you first", "Browse and apply", "Track application status"],
  },
] as const;

export default function PricingSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <SectionHeading title="Level up with MentorLagbe Pro" sub="Start free. Upgrade when you need more." />
      <div className="grid gap-6 md:grid-cols-2">
        {plans.map((p, i) => (
          <Reveal key={p.who} delay={i * 120} className="h-full">
            <div className="card flex h-full flex-col p-7">
              <h3 className="text-2xl font-extrabold">For {p.who}</h3>

              <div className="mt-5 rounded-2xl bg-paper p-5">
                <p className="font-display text-lg font-bold">Free <span className="text-muted">· $0</span></p>
                <ul className="mt-3 space-y-2">
                  {p.free.map(([t, ok]) => (
                    <li key={t} className={`flex items-center gap-2 ${ok ? "" : "text-muted line-through"}`}>
                      {ok ? <Check size={18} className="text-brand" /> : <X size={18} />} {t}
                    </li>
                  ))}
                </ul>
              </div>

              <div className={`jelly-3d mt-4 rounded-2xl p-5 text-navy ${p.accent}`}>
                <p className="flex items-center gap-2 font-display text-lg font-bold">
                  <Sparkles size={18} /> Pro <span>· ${p.price}/month</span>
                </p>
                <ul className="mt-3 space-y-2">
                  {p.pro.map((t) => (
                    <li key={t} className="flex items-center gap-2"><Check size={18} /> {t}</li>
                  ))}
                </ul>
              </div>

              <Link href="/pricing" className="btn btn-grape mt-auto self-start text-lg" style={{ marginTop: "1.5rem" }}>
                Subscribe with Stripe
              </Link>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
