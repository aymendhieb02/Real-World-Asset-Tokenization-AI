"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ElectricBorderButtonProps extends ButtonProps {
  children: React.ReactNode;
}

export function ElectricBorderButton({
  children,
  className,
  ...props
}: ElectricBorderButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative inline-block"
    >
      <Button
        variant="electric"
        className={cn("relative z-10 px-8 py-3", className)}
        {...props}
      >
        <span className="relative z-10">{children}</span>
      </Button>
    </motion.div>
  );
}

