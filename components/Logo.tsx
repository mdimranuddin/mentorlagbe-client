import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 font-display text-2xl font-extrabold tracking-tight">
      {/* speech-bubble mark */}
      <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true">
        <path d="M17 2C9 2 3 7.6 3 14.5c0 4 2 7.4 5.2 9.6L7 31l7-4.3c1 .2 2 .3 3 .3 8 0 14-5.6 14-12.5S25 2 17 2z" fill="#7655F7" />
        <path d="M10 19v-8l7 6 7-6v8" fill="none" stroke="#FFD447" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      MentorLagbe
    </Link>
  );
}
