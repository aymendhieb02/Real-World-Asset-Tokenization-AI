"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function WorldMapSVG() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Simplified world map paths (key cities/regions)
  const regions = [
    { path: "M200,150 L250,160 L280,180 L270,200 L240,190 L210,170 Z", name: "North America" },
    { path: "M300,200 L350,210 L380,230 L370,250 L340,240 L310,220 Z", name: "Europe" },
    { path: "M450,180 L500,190 L530,210 L520,230 L490,220 L460,200 Z", name: "Asia" },
    { path: "M350,280 L400,290 L430,310 L420,330 L390,320 L360,300 Z", name: "Africa" },
    { path: "M400,350 L450,360 L480,380 L470,400 L440,390 L410,370 Z", name: "Australia" },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden opacity-20">
      <svg
        viewBox="0 0 800 600"
        className="w-full h-full"
        style={{
          filter: "drop-shadow(0 0 10px rgba(0, 246, 255, 0.5))",
        }}
      >
        {regions.map((region, index) => (
          <motion.path
            key={index}
            d={region.path}
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, delay: index * 0.3 }}
          />
        ))}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f6ff" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0.8" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

