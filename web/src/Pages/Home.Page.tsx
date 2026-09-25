import { CallToAction } from "../Components/CTABanner";
import { HeroSection } from "../Components/HeroSection";
import { HowItWorks } from "../Components/HowItWorks";
import { MetricStrip } from "../Components/MetricStrip";

export function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <MetricStrip />
      <HowItWorks />
      <CallToAction />
    </div>
  );
}

export default HomePage;
