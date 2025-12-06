"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";
import ElectricBorder from "./electric-border";

interface GlassmorphismCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: React.ReactNode;
  hover?: boolean;
  useElectricBorder?: boolean;
  electricBorderColor?: string;
}

export function GlassmorphismCard({
  children,
  className,
  hover = true,
  useElectricBorder = true,
  electricBorderColor = "#00f6ff",
  ...props
}: GlassmorphismCardProps) {
  const MotionCard = motion(Card);

  const cardContent = (
    <MotionCard
      className={cn("glass border-white/10", className)}
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : undefined}
      {...(props as any)}
    >
      {children}
    </MotionCard>
  );

  if (useElectricBorder) {
    return (
      <ElectricBorder
        color={electricBorderColor}
        speed={1}
        chaos={0.5}
        thickness={2}
        style={{ borderRadius: 16 }}
      >
        {cardContent}
      </ElectricBorder>
    );
  }

  return cardContent;
}

