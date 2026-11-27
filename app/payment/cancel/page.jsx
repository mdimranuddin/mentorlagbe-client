import Link from "next/link";

export default function PaymentCancelPage() {
  return (
    <div className="mx-auto max-w-md p-10 text-center">
      <h1 className="text-2xl font-bold">Payment cancelled</h1>
      <p className="mt-2 text-muted-foreground">No money was charged. You can upgrade any time.</p>
      <Link href="/pricing" className="mt-6 inline-block underline">Back to Pricing</Link>
    </div>
  );
}
