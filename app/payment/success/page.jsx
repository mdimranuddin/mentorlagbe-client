import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { Suspense } from "react";
import { stripe } from "@/lib/stripe";
import { auth } from "@/lib/auth";

async function SuccessContent({ searchParams }) {
  const { session_id } = await searchParams;
  if (!session_id) redirect("/");

  let session;
  try { session = await stripe.checkout.sessions.retrieve(session_id); }
  catch { redirect("/"); }
  if (session.status !== "complete") redirect("/pricing");

  const { token } = await auth.api.getToken({ headers: await headers() });

  // Express re-verifies the payment with Stripe, saves it in "payments" and sets plan: "pro"
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/subscription/activate`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ sessionId: session_id }),
    cache: "no-store",
  });

  return (
    <div className="mx-auto max-w-md p-10 text-center">
      <h1 className="text-2xl font-bold">
        {res.ok ? "Welcome to MentorLagbe Pro!" : "Payment received, upgrade pending"}
      </h1>
      <p className="mt-2 text-muted-foreground">
        {res.ok ? "Your account has been upgraded." : "Please refresh this page. If it still fails, contact support."}
      </p>
      <Link href="/dashboard" className="mt-6 inline-block underline">Go to Dashboard</Link>
    </div>
  );
}

export default function PaymentSuccessPage({ searchParams }) {
  return (
    <Suspense fallback={<p className="p-10 text-center">Confirming your payment...</p>}>
      <SuccessContent searchParams={searchParams} />
    </Suspense>
  );
}
