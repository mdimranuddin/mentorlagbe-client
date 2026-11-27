"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { toast } from "sonner";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { authClient } from "@/lib/auth-client";

const links = [
  { href: "/", label: "Home" },
  { href: "/tuitions", label: "Browse Tuitions" },
  { href: "/pricing", label: "Pricing" },
  { href: "/#how-it-works", label: "How It Works" },
];

const roleStyle: Record<string, string> = {
  student: "bg-mint text-navy",
  tutor: "bg-lemon text-navy",
  admin: "bg-bubblegum text-navy",
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user as
    | { name: string; image?: string | null; role?: string }
    | undefined;

  async function handleSignOut() {
    await authClient.signOut();
    setOpen(false);
    toast.success("Signed out. See you soon!");
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 px-3 pt-3">
      <nav className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-line bg-surface/90 px-5 py-2.5 shadow-[0_14px_34px_-20px_rgba(0,0,0,.5)] backdrop-blur">
        <Logo />

        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`rounded-full px-4 py-2 text-[15px] font-semibold transition-colors hover:bg-paper ${
                  pathname === l.href ? "bg-paper text-brand" : ""
                }`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 lg:flex">
          <ThemeToggle />
          {isPending ? (
            <div className="h-10 w-32 animate-pulse rounded-full bg-paper" />
          ) : user ? (
            <>
              <Link href="/dashboard/profile" className="flex items-center gap-2 rounded-full bg-paper py-1 pl-1 pr-3" title="Update Profile">
                {user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.image} alt="" className="h-8 w-8 rounded-full object-cover" />
                ) : (
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-grape text-sm font-bold text-white">
                    {user.name?.[0]?.toUpperCase()}
                  </span>
                )}
                <span className="max-w-[110px] truncate text-sm font-bold">{user.name}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-bold capitalize ${roleStyle[user.role ?? "student"]}`}>
                  {user.role ?? "student"}
                </span>
              </Link>
              <Link href="/dashboard" className="btn btn-grape btn-sm">Dashboard</Link>
              <Link href="/dashboard/profile" className="btn btn-ghost btn-sm">Update Profile</Link>
              <button onClick={handleSignOut} className="btn btn-bubblegum btn-sm">Sign Out</button>
            </>
          ) : (
            <>
              <Link href="/sign-in" className="btn btn-ghost btn-sm">Sign In</Link>
              <Link href="/sign-up" className="btn btn-grape btn-sm">Sign Up</Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
        <ThemeToggle />
        <button
          className="grid h-10 w-10 place-items-center rounded-full bg-paper"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
        </div>
      </nav>

      {open && (
        <div className="mx-auto mt-2 max-w-6xl rounded-3xl border border-line bg-surface p-4 shadow-xl lg:hidden">
          <ul className="flex flex-col gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} onClick={() => setOpen(false)} className="block rounded-full px-4 py-3 font-semibold hover:bg-paper">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex flex-wrap gap-2 border-t border-line pt-3">
            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setOpen(false)} className="btn btn-grape btn-sm">Dashboard</Link>
                <Link href="/dashboard/profile" onClick={() => setOpen(false)} className="btn btn-ghost btn-sm">Update Profile</Link>
                <button onClick={handleSignOut} className="btn btn-bubblegum btn-sm">Sign Out</button>
              </>
            ) : (
              <>
                <Link href="/sign-in" onClick={() => setOpen(false)} className="btn btn-ghost btn-sm">Sign In</Link>
                <Link href="/sign-up" onClick={() => setOpen(false)} className="btn btn-grape btn-sm">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
