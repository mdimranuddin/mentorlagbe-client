import Link from "next/link";
import { BadgeCheck, CalendarDays, MapPin } from "lucide-react";
import type { Tuition } from "@/lib/types";
import { SUBJECT_COLOR } from "@/lib/constants";

export default function TuitionCard({ t }: { t: Tuition }) {
  const initials = t.tutorName.split(" ").map((w) => w[0]).slice(0, 2).join("");
  return (
    <article className="card group flex h-full flex-col overflow-hidden">
      <div className="relative aspect-video w-full overflow-hidden bg-lilac">
        {t.bannerImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={t.bannerImage} alt={`${t.subject} tuition banner`} loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className={`grid h-full place-items-center font-display text-6xl font-extrabold ${SUBJECT_COLOR[t.subject] ?? "bg-grape text-white"}`}>{t.subject[0]}</div>
        )}
        <span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-extrabold shadow ${t.mode === "Online" ? "bg-sky text-navy" : "bg-mint text-navy"}`}>
          {t.mode}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap gap-2 text-xs font-bold">
          <span className={`rounded-full px-3 py-1 ${SUBJECT_COLOR[t.subject] ?? "bg-lilac"}`}>{t.subject}</span>
          <span className="rounded-full bg-paper px-3 py-1 ring-1 ring-line">{t.classLevel}</span>
        </div>

        <h3 className="mt-3 line-clamp-2 min-h-[3.5rem] text-xl font-bold leading-7">{t.title}</h3>

        <div className="mt-3 flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-lemon text-xs font-extrabold text-navy">{initials}</span>
          <span className="truncate text-sm font-semibold">{t.tutorName}</span>
          {t.tutorVerified && <BadgeCheck size={17} className="shrink-0 text-brand" aria-label="Verified tutor" />}
        </div>

        <div className="mt-3 space-y-1 text-sm text-muted">
          <p className="flex items-center gap-2"><MapPin size={15} className="shrink-0" /> <span className="truncate">{t.location || "Location not set"}</span></p>
          <p className="flex items-center gap-2"><CalendarDays size={15} className="shrink-0" /> {t.daysPerWeek} days / week</p>
        </div>

        <div className="mt-auto flex items-center justify-between pt-5">
          <p className="font-display text-2xl font-extrabold">
            ৳{t.monthlyFee.toLocaleString("en-US")}<span className="text-sm font-semibold text-muted">/mo</span>
          </p>
          <Link href={`/tuitions/${t._id}`} className="btn btn-grape btn-sm">View Details</Link>
        </div>
      </div>
    </article>
  );
}
