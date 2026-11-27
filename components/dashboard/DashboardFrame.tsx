"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BadgeDollarSign, ClipboardList, FilePlus2, Home, LayoutDashboard, ListChecks, LogOut, Menu, PanelLeftClose,
  PanelLeftOpen, ShieldCheck, Sparkles, UserCog, UserRound, Users, X,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import type { AppUser } from "@/lib/types";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import { StatusBadge } from "./ui";

const NAV = {
  student: [
    { href: "/dashboard/student", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/student/my-applications", label: "My Applications", icon: ClipboardList },
    { href: "/dashboard/profile", label: "Profile", icon: UserRound },
  ],
  tutor: [
    { href: "/dashboard/tutor", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/tutor/post-tuition", label: "Post Tuition", icon: FilePlus2 },
    { href: "/dashboard/tutor/my-tuitions", label: "My Tuitions", icon: ListChecks },
    { href: "/dashboard/tutor/applicants", label: "Applicants", icon: Users },
    { href: "/dashboard/profile", label: "Profile", icon: UserRound },
  ],
  admin: [
    { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/admin/tuitions", label: "Tuitions", icon: ShieldCheck },
    { href: "/dashboard/admin/users", label: "Users", icon: UserCog },
    { href: "/dashboard/admin/transactions", label: "Transactions", icon: BadgeDollarSign },
    { href: "/dashboard/profile", label: "Profile", icon: UserRound },
  ],
} as const;

export default function DashboardFrame({ me, children }: { me: AppUser; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);   // desktop: icons only
  const [drawer, setDrawer] = useState(false);          // mobile: slide-in menu

  useEffect(() => { setDrawer(false); }, [pathname]);

  const items = NAV[me.role] ?? NAV.student;
  const upgradeable = me.role !== "admin" && me.plan !== "pro";

  async function signOut() {
    await authClient.signOut();
    toast.success("Signed out. See you soon!");
    router.push("/");
    router.refresh();
  }

  const avatar = me.image ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={me.image} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover" />
  ) : (
    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-grape font-display font-extrabold text-white">{me.name[0]?.toUpperCase()}</span>
  );

  return (
    <div className="min-h-screen bg-paper">
      {/* top bar */}
      <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-line bg-surface/90 px-4 backdrop-blur">
        <button onClick={() => setDrawer((v) => !v)} aria-label={drawer ? "Close menu" : "Open menu"} aria-expanded={drawer}
          className="grid h-10 w-10 place-items-center rounded-full bg-paper lg:hidden">
          {drawer ? <X size={20} /> : <Menu size={20} />}
        </button>
        <button onClick={() => setCollapsed((v) => !v)} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} aria-expanded={!collapsed}
          className="hidden h-10 w-10 place-items-center rounded-full bg-paper lg:grid">
          {collapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
        </button>
        <Logo />
        <div className="ml-auto flex items-center gap-2">
          <Link href="/" className="btn btn-ghost btn-sm hidden sm:inline-flex"><Home size={16} /> Back to site</Link>
          <ThemeToggle />
          <div className="hidden items-center gap-2 rounded-full bg-paper py-1 pl-1 pr-3 md:flex">
            {avatar}
            <span className="max-w-[9rem] truncate text-sm font-bold">{me.name}</span>
          </div>
          <button onClick={signOut} className="btn btn-bubblegum btn-sm"><LogOut size={16} /><span className="hidden sm:inline">Sign Out</span></button>
        </div>
      </header>

      <div className="flex">
        {drawer && <div className="fixed inset-0 top-16 z-30 bg-black/50 lg:hidden" onClick={() => setDrawer(false)} aria-hidden="true" />}

        {/* sidebar */}
        <aside
          className={`fixed bottom-0 left-0 top-16 z-40 w-64 overflow-y-auto border-r border-line bg-surface p-4 transition-all duration-200 lg:sticky lg:z-auto lg:h-[calc(100vh-4rem)] lg:shrink-0 ${collapsed ? "lg:w-[5.25rem]" : "lg:w-64"} ${drawer ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
          aria-label="Dashboard menu"
        >
          {/* user profile summary */}
          <div className={`flex items-center gap-3 rounded-2xl bg-paper p-3 ${collapsed ? "lg:justify-center lg:p-2" : ""}`}>
            {avatar}
            <div className={`min-w-0 ${collapsed ? "lg:hidden" : ""}`}>
              <p className="truncate font-extrabold">{me.name}</p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                <span className="rounded-full bg-line px-2.5 py-0.5 text-xs font-extrabold capitalize">{me.role}</span>
                {me.role !== "admin" && <StatusBadge value={me.plan ?? "free"} />}
              </div>
            </div>
          </div>

          <nav className="mt-4 flex flex-col gap-1.5">
            {items.map((i) => {
              const active = pathname === i.href || (i.href.endsWith("my-tuitions") && pathname.includes("edit-tuition"));
              return (
                <Link key={i.href} href={i.href} title={i.label} aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 font-bold transition-colors ${collapsed ? "lg:justify-center lg:px-0" : ""} ${active ? "bg-cta text-[color:var(--cta-ink)]" : "hover:bg-paper"}`}>
                  <i.icon size={20} className="shrink-0" />
                  <span className={collapsed ? "lg:hidden" : ""}>{i.label}</span>
                </Link>
              );
            })}
          </nav>

          {upgradeable && (
            <Link href="/pricing" className={`mt-6 block rounded-2xl bg-lemon p-4 text-navy ${collapsed ? "lg:hidden" : ""}`}>
              <span className="flex items-center gap-2 font-extrabold"><Sparkles size={16} /> Level up with Pro</span>
              <span className="mt-1 block text-sm">{me.role === "tutor" ? "Unlimited posts and a verified badge." : "Priority booking with tutors."}</span>
            </Link>
          )}
        </aside>

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
