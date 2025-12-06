"use client";

import { useAccount, useBalance } from "wagmi";
import { formatCurrency } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface TokenBalanceProps {
  tokenAddress?: string;
  propertyId?: string;
  label?: string;
}

export function TokenBalance({ tokenAddress, propertyId, label = "Balance" }: TokenBalanceProps) {
  const { address } = useAccount();
  
  // For demo purposes, we'll show a mock balance
  // In production, this would read from the ERC-1400 token contract
  const mockBalance = 1250.5;
  const mockValue = mockBalance * 1.05; // Assuming $1.05 per token

  if (!address) {
    return (
      <div className="text-sm text-foreground/60">
        Connect wallet to view balance
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <div className="text-sm text-foreground/60">{label}</div>
      <div className="text-2xl font-bold text-neon-cyan">
        {mockBalance.toLocaleString()} tokens
      </div>
      <div className="text-sm text-foreground/70">
        ≈ {formatCurrency(mockValue)}
      </div>
    </div>
  );
}

