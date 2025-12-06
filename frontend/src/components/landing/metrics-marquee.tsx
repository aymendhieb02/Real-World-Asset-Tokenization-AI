"use client";

import { motion } from "framer-motion";
import { formatCurrency, formatNumber } from "@/lib/utils";

const metrics = [
  { label: "Total Properties", value: "$125M", subtext: "Tokenized Assets" },
  { label: "Active Investors", value: "2,500+", subtext: "Global Users" },
  { label: "Average APY", value: "10.5%", subtext: "Annual Returns" },
  { label: "AI Accuracy", value: "92%", subtext: "Valuation Confidence" },
  { label: "Transactions", value: "15K+", subtext: "Completed Trades" },
];

export function MetricsMarquee() {
  return (
    <div className="mt-16 overflow-hidden">
      <motion.div
        className="flex space-x-12"
        animate={{
          x: [0, -50 * metrics.length * 2],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 30,
            ease: "linear",
          },
        }}
      >
        {[...metrics, ...metrics].map((metric, index) => (
          <div
            key={index}
            className="flex-shrink-0 text-center glass rounded-lg p-6 min-w-[200px]"
          >
            <div className="text-3xl font-bold bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent mb-2">
              {metric.value}
            </div>
            <div className="text-sm text-foreground/60">{metric.label}</div>
            <div className="text-xs text-foreground/40 mt-1">{metric.subtext}</div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

