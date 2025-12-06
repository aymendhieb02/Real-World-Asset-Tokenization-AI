"use client";

import { ResponsiveRadar } from "@nivo/radar";

interface RiskRadarChartProps {
  data: {
    category: string;
    score: number;
  }[];
}

export function RiskRadarChart({ data }: RiskRadarChartProps) {
  const chartData = data.map((item) => ({
    category: item.category,
    value: item.score,
  }));

  return (
    <ResponsiveRadar
      data={chartData}
      keys={["value"]}
      indexBy="category"
      valueFormat=" >-.0f"
      margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
      borderColor={{ from: "color" }}
      gridLabelOffset={36}
      dotSize={10}
      dotColor={{ theme: "background" }}
      dotBorderWidth={2}
      colors={{ scheme: "nivo" }}
      fillOpacity={0.25}
      blendMode="multiply"
      motionConfig="wobbly"
      theme={{
        background: "transparent",
        text: {
          fontSize: 12,
          fill: "rgba(255,255,255,0.7)",
        },
        grid: {
          line: {
            stroke: "rgba(255,255,255,0.1)",
          },
        },
      }}
    />
  );
}

