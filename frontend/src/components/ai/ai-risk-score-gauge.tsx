"use client";

import { GlassmorphismCard } from "@/components/animations/glassmorphism-card";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Shield, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

interface AIRiskScoreGaugeProps {
  riskScore: number; // 0-100
  size?: number;
}

export function AIRiskScoreGauge({ riskScore, size = 200 }: AIRiskScoreGaugeProps) {
  const radius = size / 2 - 20;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (riskScore / 100) * circumference;

  const getRiskLevel = () => {
    if (riskScore < 30) return { label: "Low", color: "text-green-400", bgColor: "bg-green-500/20", borderColor: "border-green-500/30", icon: CheckCircle2 };
    if (riskScore < 60) return { label: "Medium", color: "text-yellow-400", bgColor: "bg-yellow-500/20", borderColor: "border-yellow-500/30", icon: Shield };
    return { label: "High", color: "text-red-400", bgColor: "bg-red-500/20", borderColor: "border-red-500/30", icon: AlertTriangle };
  };

  const riskLevel = getRiskLevel();
  const Icon = riskLevel.icon;

  return (
    <GlassmorphismCard>
      <CardHeader>
        <CardTitle className="text-lg">Risk Score</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="transform -rotate-90">
              {/* Background circle */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth="12"
                className="text-foreground/10"
              />
              {/* Progress circle */}
              <motion.circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                className={riskLevel.color}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className={`text-4xl font-bold ${riskLevel.color}`}>
                {riskScore}
              </div>
              <div className="text-sm text-foreground/60">/ 100</div>
            </div>
          </div>

          <Badge variant="outline" className={`${riskLevel.bgColor} ${riskLevel.borderColor} ${riskLevel.color} flex items-center space-x-2`}>
            <Icon size={16} />
            <span>{riskLevel.label} Risk</span>
          </Badge>
        </div>
      </CardContent>
    </GlassmorphismCard>
  );
}

