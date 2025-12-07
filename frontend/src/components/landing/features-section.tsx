"use client";

import { motion } from "framer-motion";
import { GlassmorphismCard } from "@/components/animations/glassmorphism-card";
import { Brain, Shield, Zap, TrendingUp, Globe, Lock } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Property Valuation",
    description: "View property valuations and investment details. Get insights into property performance and potential returns.",
  },
  {
    icon: Shield,
    title: "Blockchain Security",
    description: "ERC-1400 compliant tokens on Polygon. Transparent, immutable ownership records secured by blockchain technology.",
  },
  {
    icon: Zap,
    title: "Instant Tokenization",
    description: "Transform real estate into tradeable tokens in minutes. Fractional ownership made simple and accessible.",
  },
  {
    icon: TrendingUp,
    title: "Portfolio Tracking",
    description: "Track your property investments and portfolio performance. Monitor returns and manage your holdings.",
  },
  {
    icon: Globe,
    title: "Global Access",
    description: "Invest in real estate anywhere in the world with borderless transactions.",
  },
  {
    icon: Lock,
    title: "KYC Compliance",
    description: "Built-in KYC verification ensures regulatory compliance. Secure and compliant investment platform.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Powerful Features for{" "}
            <span className="bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
              Modern Investors
            </span>
          </h2>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            Everything you need to invest in real estate with confidence
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <GlassmorphismCard className="p-6 h-full">
                  <div className="mb-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center">
                      <Icon className="text-white" size={24} />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-foreground/70">{feature.description}</p>
                </GlassmorphismCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

