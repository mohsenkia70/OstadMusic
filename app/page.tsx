import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/sections/hero-section";
import { StatsSection } from "@/components/sections/stats-section";
import { StorySection } from "@/components/sections/story-section";
import { StepsSection } from "@/components/sections/steps-section";
import { BenefitsSection } from "@/components/sections/benefits-section";
import { TeachersSection } from "@/components/sections/teachers-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { FaqSection } from "@/components/sections/faq-section";
import { CtaSection } from "@/components/sections/cta-section";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <StatsSection />
        <StorySection />
        <StepsSection />
        <BenefitsSection />
        <TeachersSection />
        <TestimonialsSection />
        <FaqSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
