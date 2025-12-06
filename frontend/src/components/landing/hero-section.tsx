"use client";

import { ElectricBorderButton } from "@/components/animations/electric-border-button";
import { GradientOrb } from "@/components/animations/gradient-orb";
import { WorldMapSVG } from "@/components/animations/world-map-svg";
import { NoiseTextureOverlay } from "@/components/animations/noise-texture-overlay";
import { TypingEffect } from "@/components/animations/typing-effect";
import { MetricsMarquee } from "@/components/landing/metrics-marquee";
import GhostCursor from "@/components/animations/ghost-cursor";
import Link from "next/link";
import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ position: 'relative' }}>
      <GhostCursor
        color="#00f6ff"
        brightness={0.5}
        edgeIntensity={0}
        trailLength={30}
        inertia={0.6}
        grainIntensity={0.03}
        bloomStrength={0.07}
        bloomRadius={0.9}
        bloomThreshold={0.04}
        fadeDelayMs={900}
        fadeDurationMs={1300}
      />
      {/* Background Elements */}
      <GradientOrb size={600} color="cyan" className="top-20 left-10" />
      <GradientOrb size={500} color="purple" className="bottom-20 right-10" delay={2} />
      <GradientOrb size={400} color="blue" className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" delay={4} />
      <WorldMapSVG />
      <NoiseTextureOverlay />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="block mb-2">Invest in Real-Estate.</span>
            <span className="block bg-gradient-to-r from-neon-cyan via-neon-purple to-electric-blue bg-clip-text text-transparent">
              Powered by AI.
            </span>
            <span className="block mt-2">Secured by Blockchain.</span>
          </h1>

          <div className="text-xl md:text-2xl text-foreground/70 mb-8 h-12">
            <TypingEffect
              texts={[
                "AI-powered property valuation in seconds",
                "Fractional ownership through tokenization",
                "Global real estate investment made simple",
                "Transparent, secure, and accessible",
              ]}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href="/properties">
              <ElectricBorderButton size="lg">
                Explore Properties
              </ElectricBorderButton>
            </Link>
            <Link href="/education">
              <ElectricBorderButton size="lg" variant="outline" className="border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10">
                Learn More
              </ElectricBorderButton>
            </Link>
          </div>
        </motion.div>

        {/* Metrics Marquee */}
        <MetricsMarquee />
      </div>
    </section>
  );
}

