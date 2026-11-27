"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export function PageHeader({ title, sub, action }: { title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-extrabold sm:text-4xl">{title}</h1>
        {sub && <p className="mt-2 text-muted">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

const badge: Record<string, string> = {
  pending: "bg-lemon text-navy", approved: "bg-mint text-navy", accepted: "bg-mint text-navy",
  rejected: "bg-bubblegum text-navy", active: "bg-mint text-navy", closed: "bg-line text-ink",
  pro: "bg-brand/15 text-brand", free: "bg-line text-ink",
};
export function StatusBadge({ value }: { value: string }) {
  return <span className={`inline-block rounded-full px-3 py-1 text-xs font-extrabold capitalize ${badge[value] ?? "bg-line"}`}>{value}</span>;
}

export function Spinner({ label = "Loading..." }: { label?: string }) {
  return <div className="flex items-center justify-center gap-2 py-16 text-muted" role="status"><Loader2 className="animate-spin" /> {label}</div>;
}

export function ErrorBox({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="card p-8 text-center hover:!translate-y-0">
      <p className="font-display text-xl font-bold">Something went wrong</p>
      <p className="mt-1 text-muted">{message}</p>
      {onRetry && <button onClick={onRetry} className="btn btn-grape btn-sm mt-4">Try again</button>}
    </div>
  );
}

export function Empty({ title, text, href, cta }: { title: string; text: string; href?: string; cta?: string }) {
  return (
    <div className="card p-12 text-center hover:!translate-y-0">
      <p className="font-display text-2xl font-bold">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-muted">{text}</p>
      {href && cta && <Link href={href} className="btn btn-grape mt-6">{cta}</Link>}
    </div>
  );
}

export function TableWrap({ children }: { children: React.ReactNode }) {
  return <div className="card overflow-x-auto hover:!translate-y-0"><table className="w-full min-w-[40rem] text-left text-sm">{children}</table></div>;
}
export const th = "px-4 py-3 text-xs font-extrabold uppercase tracking-wide text-muted";
export const td = "px-4 py-3 align-middle";

export function ConfirmDialog({ open, title, text, confirmLabel = "Confirm", danger, busy, onConfirm, onCancel }: {
  open: boolean; title: string; text: string; confirmLabel?: string; danger?: boolean; busy?: boolean;
  onConfirm: () => void; onCancel: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onCancel(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onCancel]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/60 p-4" role="dialog" aria-modal="true" aria-label={title} onClick={onCancel}>
      <div className="card w-full max-w-md p-7 hover:!translate-y-0" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-extrabold">{title}</h2>
        <p className="mt-2 text-muted">{text}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onCancel} className="btn btn-ghost btn-sm">Cancel</button>
          <button onClick={onConfirm} disabled={busy} className={`btn btn-sm disabled:opacity-60 ${danger ? "bg-red-600 text-white" : "btn-grape"}`}>
            {busy ? "Please wait..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
