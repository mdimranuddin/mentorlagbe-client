export default function Field({ label, error, ...props }: { label: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-bold">{label}</span>
      <input
        {...props}
        aria-invalid={!!error}
        className={`w-full rounded-2xl bg-surface px-4 py-3.5 text-base outline-none ring-1 transition focus:ring-2 focus:ring-brand ${error ? "ring-red-500" : "ring-line"}`}
      />
      {error && <span className="mt-1 block text-sm font-semibold text-red-500">{error}</span>}
    </label>
  );
}
