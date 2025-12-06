"use client";

import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { CTASection } from "@/components/landing/cta-section";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { AIChatAssistantDrawer } from "@/components/ai/ai-chat-assistant-drawer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-midnight-navy">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <CTASection />
      </main>
      <Footer />
      <AIChatAssistantDrawer />
    </div>
  );
}

