"use client";

import { ResponsivePie } from "@nivo/pie";

interface PortfolioAllocationChartProps {
  data: {
    id: string;
    label: string;
    value: number;
    color?: string;
  }[];
}

export function PortfolioAllocationChart({ data }: PortfolioAllocationChartProps) {
  return (
    <ResponsivePie
      data={data}
      margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
      innerRadius={0.5}
      padAngle={0.7}
      cornerRadius={3}
      activeOuterRadiusOffset={8}
      borderWidth={1}
      borderColor={{
        from: "color",
        modifiers: [["darker", 0.2]],
      }}
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextColor="rgba(255,255,255,0.7)"
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: "color" }}
      arcLabelsSkipAngle={10}
      arcLabelsTextColor={{
        from: "color",
        modifiers: [["darker", 2]],
      }}
      colors={{ scheme: "nivo" }}
      theme={{
        background: "transparent",
        text: {
          fontSize: 12,
          fill: "rgba(255,255,255,0.7)",
        },
      }}
      legends={[
        {
          anchor: "bottom",
          direction: "row",
          justify: false,
          translateX: 0,
          translateY: 56,
          itemsSpacing: 0,
          itemWidth: 100,
          itemHeight: 18,
          itemTextColor: "rgba(255,255,255,0.7)",
          itemDirection: "left-to-right",
          itemOpacity: 1,
          symbolSize: 18,
          symbolShape: "circle",
        },
      ]}
    />
  );
}

