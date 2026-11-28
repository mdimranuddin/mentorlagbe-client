import Logo from "@/components/Logo";
import { Check } from "lucide-react";

export default function AuthShell({ title, sub, children, footer }: {
  title: string; sub: string; children: React.ReactNode; footer: React.ReactNode;
}) {
  return (
    <div className="mx-auto grid min-h-[calc(100vh-6rem)] max-w-6xl gap-8 px-6 py-10 lg:grid-cols-2 lg:items-center">
      {/* brand side */}
      <aside className="relative hidden overflow-hidden rounded-[2rem] bg-grape p-10 text-white lg:block">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10" />
        <div className="absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-lemon/30 blur-2xl" />
        <div className="relative">
          <div className="inline-block rounded-full bg-white px-4 py-2 text-navy"><Logo /></div>
          <h2 className="mt-10 text-4xl font-extrabold leading-tight">Your next mentor is one click away.</h2>
          <ul className="mt-8 space-y-4 text-lg">
            {["Search approved tuitions by subject, class and mode", "Apply in a minute and track every status", "Tutors: post a tuition and manage applicants"].map((x) => (
              <li key={x} className="flex items-start gap-3">
                <span className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white/20"><Check size={14} /></span>{x}
              </li>
            ))}
          </ul>
          <div className="mt-10 rounded-3xl bg-white/12 p-5 ring-1 ring-white/20">
            <p className="font-bold">You&apos;re one step closer to finding your mentor!</p>
            <p className="mt-1 text-sm text-white/80">Free to start. Upgrade to Pro any time.</p>
          </div>
        </div>
      </aside>

      {/* form side */}
      <section className="mx-auto w-full max-w-md">
        <div className="mb-6 inline-block lg:hidden"><Logo /></div>
        <h1 className="text-4xl font-extrabold">{title}</h1>
        <p className="mt-2 text-muted">{sub}</p>
        <div className="mt-8">{children}</div>
        <div className="mt-6 text-center text-muted">{footer}</div>
      </section>
    </div>
  );
}
