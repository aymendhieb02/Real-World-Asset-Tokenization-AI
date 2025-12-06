"use client";

import { cn } from "@/lib/utils";

interface NoiseTextureOverlayProps {
  className?: string;
  opacity?: number;
}

export function NoiseTextureOverlay({
  className,
  opacity = 0.05,
}: NoiseTextureOverlayProps) {
  return (
    <div
      className={cn("absolute inset-0 pointer-events-none noise-texture", className)}
      style={{ opacity }}
    />
  );
}

