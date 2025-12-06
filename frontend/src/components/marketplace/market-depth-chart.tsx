"use client";

import { Order } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Line } from "recharts";
import { formatCurrency } from "@/lib/utils";

interface MarketDepthChartProps {
  orders: Order[];
}

export function MarketDepthChart({ orders }: MarketDepthChartProps) {
  // Aggregate orders by price
  const buyOrders = orders.filter((o) => o.type === "buy" && o.status === "pending");
  const sellOrders = orders.filter((o) => o.type === "sell" && o.status === "pending");

  const buyDepth = buyOrders.reduce((acc, order) => {
    const price = order.price.toFixed(2);
    acc[price] = (acc[price] || 0) + order.amount;
    return acc;
  }, {} as Record<string, number>);

  const sellDepth = sellOrders.reduce((acc, order) => {
    const price = order.price.toFixed(2);
    acc[price] = (acc[price] || 0) + order.amount;
    return acc;
  }, {} as Record<string, number>);

  const chartData = [
    ...Object.entries(buyDepth).map(([price, amount]) => ({
      price: parseFloat(price),
      buy: amount,
      sell: 0,
    })),
    ...Object.entries(sellDepth).map(([price, amount]) => ({
      price: parseFloat(price),
      buy: 0,
      sell: amount,
    })),
  ].sort((a, b) => a.price - b.price);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Depth</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="price"
              stroke="rgba(255,255,255,0.5)"
              style={{ fontSize: "12px" }}
              tickFormatter={(value) => formatCurrency(value)}
            />
            <YAxis
              stroke="rgba(255,255,255,0.5)"
              style={{ fontSize: "12px" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(2, 6, 23, 0.9)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="buy" fill="#22c55e" name="Buy Orders" />
            <Bar dataKey="sell" fill="#ef4444" name="Sell Orders" />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

