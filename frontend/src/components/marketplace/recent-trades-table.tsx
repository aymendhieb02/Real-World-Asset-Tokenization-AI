"use client";

import { Trade } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatCurrency, formatDate, truncateAddress } from "@/lib/utils";
import { ArrowUp, ArrowDown, ExternalLink } from "lucide-react";
import Link from "next/link";

interface RecentTradesTableProps {
  trades: Trade[];
}

export function RecentTradesTable({ trades }: RecentTradesTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Trades</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-2 px-4 text-sm font-semibold">Type</th>
                <th className="text-left py-2 px-4 text-sm font-semibold">Price</th>
                <th className="text-left py-2 px-4 text-sm font-semibold">Amount</th>
                <th className="text-left py-2 px-4 text-sm font-semibold">Total</th>
                <th className="text-left py-2 px-4 text-sm font-semibold">Time</th>
                <th className="text-left py-2 px-4 text-sm font-semibold">Transaction</th>
              </tr>
            </thead>
            <tbody>
              {trades.length > 0 ? (
                trades.slice(0, 20).map((trade) => (
                  <tr key={trade.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-2 px-4">
                      <div className={`flex items-center space-x-1 ${trade.type === "buy" ? "text-green-400" : "text-red-400"}`}>
                        {trade.type === "buy" ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                        <span className="text-sm font-medium uppercase">{trade.type}</span>
                      </div>
                    </td>
                    <td className="py-2 px-4 text-sm">{formatCurrency(trade.price)}</td>
                    <td className="py-2 px-4 text-sm">{trade.amount.toLocaleString()}</td>
                    <td className="py-2 px-4 text-sm font-semibold">{formatCurrency(trade.total)}</td>
                    <td className="py-2 px-4 text-sm text-foreground/60">{formatDate(trade.timestamp)}</td>
                    <td className="py-2 px-4">
                      <Link
                        href={`https://amoy.polygonscan.com/tx/${trade.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-neon-cyan hover:underline text-sm"
                      >
                        <span>{truncateAddress(trade.txHash)}</span>
                        <ExternalLink size={14} />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-foreground/60">
                    No recent trades
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

