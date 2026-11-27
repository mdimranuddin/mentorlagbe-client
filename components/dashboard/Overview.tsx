"use client";

import Link from "next/link";
import { useMe } from "./context";
import { ErrorBox, PageHeader, Spinner } from "./ui";
import { useApi } from "@/lib/useApi";

type Stats = Record<string, number | string>;
type Role = "student" | "tutor" | "admin";

const CARDS: Record<Role, [string, string, string][]> = {
  student: [["totalApplied", "Total applied tuitions", "bg-sky"], ["accepted", "Accepted applications", "bg-mint"], ["pending", "Pending applications", "bg-lemon"], ["plan", "Current plan", "bg-grape text-white"]],
  tutor: [["totalTuitions", "Tuitions posted", "bg-sky"], ["activeApproved", "Active and approved", "bg-mint"], ["totalApplicants", "Applicants received", "bg-lemon"], ["plan", "Current plan", "bg-grape text-white"]],
  admin: [["totalUsers", "Total users", "bg-sky"], ["totalTutors", "Total tutors", "bg-lemon"], ["pendingTuitions", "Pending tuitions", "bg-bubblegum"], ["approvedTuitions", "Approved tuitions", "bg-mint"], ["totalRevenue", "Stripe revenue", "bg-grape text-white"]],
};
const COLS: Record<number, string> = { 4: "xl:grid-cols-4", 5: "xl:grid-cols-5" };

const ACTIONS: Record<Role, [string, string][]> = {
  student: [["/tuitions", "Find a tuition"], ["/dashboard/student/my-applications", "Track applications"]],
  tutor: [["/dashboard/tutor/post-tuition", "Post a tuition"], ["/dashboard/tutor/applicants", "Review applicants"]],
  admin: [["/dashboard/admin/tuitions", "Review pending tuitions"], ["/dashboard/admin/transactions", "See transactions"]],
};

export default function Overview() {
  const me = useMe();
  const role = me.role as Role;
  const { data, loading, error, reload } = useApi<Stats>(`/api/stats/${role}`);
  const cards = CARDS[role];
  const greeting = { student: "Ready to find your next mentor?", tutor: "Your next teaching opportunity is waiting!", admin: "Here is how MentorLagbe is doing." }[role];

  function show(key: string) {
    const v = data?.[key];
    if (key === "totalRevenue") return `$${Number(v ?? 0).toLocaleString("en-US")}`;
    if (key === "plan") return String(v ?? me.plan ?? "free").replace(/^./, (c) => c.toUpperCase());
    return v ?? 0;
  }

  return (
    <>
      <PageHeader title={`Hello, ${me.name.split(" ")[0]}`} sub={greeting} />
      {loading ? <Spinner /> : error ? <ErrorBox message={error} onRetry={reload} /> : (
        <>
          <div className={`grid gap-4 sm:grid-cols-2 ${COLS[cards.length] ?? ""}`}>
            {cards.map(([key, label, color]) => (
              <div key={key} className={`jelly-3d rounded-3xl p-6 ${color} ${color.includes("text-white") ? "" : "text-navy"}`}>
                <p className="font-semibold">{label}</p>
                <p className="mt-2 font-display text-5xl font-extrabold">{show(key)}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {ACTIONS[role].map(([href, label], i) => (
              <Link key={href} href={href} className={`btn ${i === 0 ? "btn-grape" : "btn-ghost"}`}>{label}</Link>
            ))}
          </div>
        </>
      )}
    </>
  );
}
