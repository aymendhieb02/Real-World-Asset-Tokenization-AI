"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface NeonCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: React.ReactNode;
  glowColor?: "cyan" | "purple" | "blue";
}

export function NeonCard({
  children,
  className,
  glowColor = "cyan",
  ...props
}: NeonCardProps) {
  const glowClasses = {
    cyan: "neon-glow",
    purple: "neon-glow-purple",
    blue: "shadow-[0_0_20px_rgba(37,99,235,0.5)]",
  };

  const MotionCard = motion(Card);

  return (
    <MotionCard
      className={cn(
        "border-2 border-neon-cyan/50 bg-midnight-dark/50",
        glowClasses[glowColor],
        className
      )}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      {...(props as any)}
    >
      {children}
    </MotionCard>
  );
}

