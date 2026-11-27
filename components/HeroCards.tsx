import Link from "next/link";
import { Check } from "lucide-react";

// These three cards mirror real seeded tuitions, so the hero shows the actual product.
const cards = [
  { initials: "RA", color: "bg-lemon", name: "Rafiq Ahmed", meta: "Math · Dhanmondi, Dhaka", chips: ["Class 9-10", "Offline", "4 days/wk"], fee: "3,000", subject: "Math" },
  { initials: "NJ", color: "bg-mint", name: "Nusrat Jahan", meta: "IELTS · Online", chips: ["Adult", "Online", "5 days/wk"], fee: "4,000", subject: "IELTS", verified: true },
  { initials: "TH", color: "bg-sky", name: "Tanvir Hasan", meta: "Programming · Online", chips: ["Adult", "Online", "3 days/wk"], fee: "3,500", subject: "Programming" },
];

function TutorCard({ c, className = "", style }: { c: (typeof cards)[number]; className?: string; style?: React.CSSProperties }) {
  return (
    <Link
      href={`/tuitions?subject=${encodeURIComponent(c.subject)}`}
      style={style}
      className={`card block w-full p-5 sm:w-[21rem] ${className}`}
    >
      <div className="flex items-center gap-3">
        <span className={`grid h-12 w-12 place-items-center rounded-full font-display text-lg font-extrabold text-navy ${c.color}`}>{c.initials}</span>
        <div>
          <p className="flex items-center gap-1 font-bold">
            {c.name}
            {c.verified && <Check size={16} className="text-brand" aria-label="Verified" />}
          </p>
          <p className="text-sm text-muted">{c.meta}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {c.chips.map((x) => (
          <span key={x} className="rounded-full bg-paper px-3 py-1 text-xs font-bold ring-1 ring-line">{x}</span>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between">
        <p className="font-display text-2xl font-extrabold">৳{c.fee}<span className="text-sm font-semibold text-muted">/mo</span></p>
        <span className="rounded-full bg-cta px-4 py-2 text-sm font-extrabold text-[color:var(--cta-ink)]">Apply</span>
      </div>
    </Link>
  );
}

export default function HeroCards() {
  return (
    <>
      {/* desktop: overlapping stack */}
      <div className="relative hidden h-[34rem] lg:block">
        <TutorCard c={cards[0]} className="absolute left-[4%] top-2" style={{ transform: "rotate(-3deg)" }} />
        <TutorCard c={cards[1]} className="absolute left-[20%] top-[12.5rem] z-10" style={{ transform: "rotate(2.5deg)" }} />
        <TutorCard c={cards[2]} className="absolute left-0 top-[23.5rem]" style={{ transform: "rotate(-1.5deg)" }} />
        <div className="absolute -right-4 -top-2 z-20 flex items-center gap-2 rounded-full bg-surface px-4 py-2.5 text-sm font-bold shadow-xl ring-1 ring-line">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-mint text-navy"><Check size={14} /></span>
          Application accepted
        </div>
      </div>
      {/* tablet / mobile: simple list */}
      <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
        <TutorCard c={cards[0]} className="sm:!w-full" />
        <TutorCard c={cards[1]} className="sm:!w-full" />
      </div>
    </>
  );
}
