"use client";

import { motion } from "framer-motion";
import { Search, Brain, Coins, TrendingUp } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Discover Properties",
    description: "Browse our catalog of tokenized real estate properties. Filter by location, type, APY, and risk level.",
  },
  {
    number: "02",
    icon: Brain,
    title: "Property Analysis",
    description: "View detailed property information, tokenomics, and investment details for any property.",
  },
  {
    number: "03",
    icon: Coins,
    title: "Purchase Tokens",
    description: "Buy property tokens directly. Fractional ownership starts at $10.",
  },
  {
    number: "04",
    icon: TrendingUp,
    title: "Earn & Trade",
    description: "Receive dividends from rental income and property appreciation.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-24 relative bg-midnight-dark/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            How It{" "}
            <span className="bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            Start investing in real estate in just 4 simple steps
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                <div className="glass rounded-lg p-6 h-full relative">
                  <div className="absolute -top-4 -left-4 w-16 h-16 rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center text-2xl font-bold">
                    {step.number}
                  </div>
                  <div className="mt-8 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-neon-cyan/20 flex items-center justify-center">
                      <Icon className="text-neon-cyan" size={24} />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-foreground/70">{step.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

