export default function SectionHeading({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-10 max-w-2xl">
      <h2 className="text-3xl font-extrabold sm:text-4xl">{title}</h2>
      {sub && <p className="mt-3 text-lg text-muted">{sub}</p>}
    </div>
  );
}
