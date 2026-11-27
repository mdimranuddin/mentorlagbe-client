"use client";
export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-lg px-6 py-24 text-center">
      <h1 className="text-3xl font-extrabold">Something went wrong</h1>
      <p className="mt-2 text-muted">It&apos;s not you, it&apos;s us. Please try again.</p>
      <button onClick={reset} className="btn btn-grape mt-8">Try again</button>
    </div>
  );
}
