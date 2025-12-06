"use client";

import { Order } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { ArrowUp, ArrowDown } from "lucide-react";

interface OrderBookProps {
  orders: Order[];
}

export function OrderBook({ orders }: OrderBookProps) {
  const buyOrders = orders.filter((o) => o.type === "buy" && o.status === "pending").sort((a, b) => b.price - a.price);
  const sellOrders = orders.filter((o) => o.type === "sell" && o.status === "pending").sort((a, b) => a.price - b.price);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Buy Orders */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-green-400">
            <ArrowUp size={20} />
            <span>Buy Orders</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {buyOrders.length > 0 ? (
              buyOrders.slice(0, 10).map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-2 glass rounded text-sm"
                >
                  <div className="flex-1">
                    <div className="font-semibold">{formatCurrency(order.price)}</div>
                    <div className="text-xs text-foreground/60">{order.amount} tokens</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatCurrency(order.total)}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-foreground/60 py-8">No buy orders</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Sell Orders */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-red-400">
            <ArrowDown size={20} />
            <span>Sell Orders</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {sellOrders.length > 0 ? (
              sellOrders.slice(0, 10).map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-2 glass rounded text-sm"
                >
                  <div className="flex-1">
                    <div className="font-semibold">{formatCurrency(order.price)}</div>
                    <div className="text-xs text-foreground/60">{order.amount} tokens</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatCurrency(order.total)}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-foreground/60 py-8">No sell orders</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

