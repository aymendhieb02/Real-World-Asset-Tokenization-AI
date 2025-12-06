"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GradientOrbProps {
  className?: string;
  size?: number;
  color?: "cyan" | "purple" | "blue";
  delay?: number;
}

export function GradientOrb({
  className,
  size = 400,
  color = "cyan",
  delay = 0,
}: GradientOrbProps) {
  const colors = {
    cyan: "from-neon-cyan/30 via-cyber-green/20 to-transparent",
    purple: "from-neon-purple/30 via-electric-blue/20 to-transparent",
    blue: "from-electric-blue/30 via-neon-cyan/20 to-transparent",
  };

  return (
    <motion.div
      className={cn(
        "absolute rounded-full blur-3xl opacity-50",
        `bg-gradient-to-br ${colors[color]}`,
        className
      )}
      style={{ width: size, height: size }}
      animate={{
        x: [0, 100, 0],
        y: [0, -100, 0],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    />
  );
}

