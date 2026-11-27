import Link from "next/link";

export default function CtaBand() {
  return (
    <section className="mx-auto max-w-6xl px-6 pt-10">
      <div className="jelly-3d flex flex-col items-start justify-between gap-6 rounded-[2rem] bg-grape p-10 text-white md:flex-row md:items-center">
        <div>
          <h2 className="text-3xl font-extrabold sm:text-4xl">Your next teaching opportunity is waiting!</h2>
          <p className="mt-2 text-lg text-white/85">Create a free tutor account and post your first tuition today.</p>
        </div>
        <Link href="/sign-up?role=tutor" className="btn btn-lemon text-lg">Become a Tutor</Link>
      </div>
    </section>
  );
}
