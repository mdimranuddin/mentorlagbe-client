import Hero from "@/components/Hero";
import AudienceCards from "@/components/AudienceCards";
import PopularSubjects from "@/components/PopularSubjects";
import FeaturedTuitions from "@/components/FeaturedTuitions";
import HowItWorks from "@/components/HowItWorks";
import PricingSection from "@/components/PricingSection";
import StatsAndTestimonials from "@/components/StatsAndTestimonials";
import CtaBand from "@/components/CtaBand";

export default function HomePage() {
  return (
    <>
      <Hero />
      <AudienceCards />
      <PopularSubjects />
      <FeaturedTuitions />
      <HowItWorks />
      <PricingSection />
      <StatsAndTestimonials />
      <CtaBand />
    </>
  );
}
