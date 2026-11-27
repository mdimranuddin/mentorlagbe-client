import PricingPlans from "@/components/PricingPlans";

export const metadata = { title: "Pricing – MentorLagbe" };

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-4xl font-extrabold sm:text-5xl">Level up with MentorLagbe Pro</h1>
      <p className="mt-3 max-w-2xl text-lg text-muted">Start free. Upgrade when you need unlimited posts or priority booking. Payments are handled securely by Stripe.</p>
      <div className="mt-10"><PricingPlans /></div>
      <p className="mt-8 text-sm text-muted">Testing? Use card 4242 4242 4242 4242, any future date, any CVC.</p>
    </div>
  );
}
