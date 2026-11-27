import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { auth } from "@/lib/auth";

// Price is decided HERE on the server from the user's role. The browser sends nothing.
const PLANS = {
  tutor:   { name: "MentorLagbe Pro Tutor Plan",   cents: 1500 },
  student: { name: "MentorLagbe Pro Student Plan", cents: 1000 },
};

export async function POST() {
  try {
    const h = await headers();
    const session = await auth.api.getSession({ headers: h });
    if (!session) return NextResponse.json({ error: "Please sign in first" }, { status: 401 });

    const plan = PLANS[session.user.role];
    if (!plan) return NextResponse.json({ error: "Only students and tutors can buy Pro" }, { status: 403 });
    if (session.user.plan === "pro") return NextResponse.json({ error: "You are already on Pro" }, { status: 400 });

    const origin = h.get("origin");
    const checkout = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{
        price_data: {
          currency: "usd",
          unit_amount: plan.cents,                       // cents: $15 = 1500
          recurring: { interval: "month" },
          product_data: { name: plan.name },
        },
        quantity: 1,
      }],
      customer_email: session.user.email,
      metadata: { userEmail: session.user.email, userRole: session.user.role },
      success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/payment/cancel`,
    });
    return NextResponse.json({ url: checkout.url });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: err.statusCode || 500 });
  }
}
