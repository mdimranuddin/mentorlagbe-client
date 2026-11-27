import Link from "next/link";
export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-6 py-24 text-center">
      <p className="font-display text-8xl font-extrabold text-brand">404</p>
      <h1 className="mt-4 text-3xl font-extrabold">We couldn&apos;t find that page</h1>
      <p className="mt-2 text-muted">The link may be broken, or the tuition was removed.</p>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/" className="btn btn-grape">Back to Home</Link>
        <Link href="/tuitions" className="btn btn-ghost">Browse Tuitions</Link>
      </div>
    </div>
  );
}
