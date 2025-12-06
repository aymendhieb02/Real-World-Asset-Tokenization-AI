"use client";

import { GlassmorphismCard } from "@/components/animations/glassmorphism-card";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AIValuation } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface AITrendPredictionChartProps {
  valuation: AIValuation;
}

export function AITrendPredictionChart({ valuation }: AITrendPredictionChartProps) {
  const data = [
    { month: "Now", value: valuation.value },
    { month: "+3M", value: valuation.predictedValue6Months ? valuation.value + (valuation.predictedValue6Months - valuation.value) * 0.5 : valuation.value },
    { month: "+6M", value: valuation.predictedValue6Months || valuation.value },
    { month: "+9M", value: valuation.predictedValue12Months ? valuation.predictedValue6Months! + (valuation.predictedValue12Months - valuation.predictedValue6Months!) * 0.5 : valuation.value },
    { month: "+12M", value: valuation.predictedValue12Months || valuation.value },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass border border-white/10 rounded-lg p-3">
          <p className="text-sm font-semibold">{payload[0].payload.month}</p>
          <p className="text-neon-cyan font-bold">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <GlassmorphismCard>
      <CardHeader>
        <CardTitle>Value Trend Prediction</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="month"
              stroke="rgba(255,255,255,0.5)"
              style={{ fontSize: "12px" }}
            />
            <YAxis
              stroke="rgba(255,255,255,0.5)"
              style={{ fontSize: "12px" }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#00f6ff"
              strokeWidth={3}
              dot={{ fill: "#00f6ff", r: 4 }}
              activeDot={{ r: 6, fill: "#8b5cf6" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </GlassmorphismCard>
  );
}

