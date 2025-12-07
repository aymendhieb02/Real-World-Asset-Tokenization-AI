"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

interface BuyTokenFormProps {
  propertyId: string;
  pricePerToken: number;
  tokensAvailable: number;
  reserveIn?: number;
  reserveOut?: number;
}

export function BuyTokenForm({
  propertyId,
  pricePerToken,
  tokensAvailable,
}: BuyTokenFormProps) {
  const { isConnected } = useAccount();
  const [amount, setAmount] = useState("");

  const usdAmount = parseFloat(amount) || 0;
  const tokensToReceive = amount ? usdAmount / pricePerToken : 0;

  const handleBuy = async () => {
    if (!amount || !isConnected) return;
    // Simple mock purchase - no blockchain integration
    alert(`Purchase ${tokensToReceive.toFixed(2)} tokens for ${formatCurrency(usdAmount)}`);
  };

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Purchase Tokens</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-foreground/70 mb-4">Connect your wallet to purchase tokens</p>
            <ConnectButton />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Purchase Tokens</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Amount (USD)</label>
            <Input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            {amount && (
              <div className="text-xs text-foreground/60 mt-1">
                ≈ {usdAmount / pricePerToken} tokens
              </div>
            )}
          </div>

          {amount && (
            <div className="space-y-2 p-3 glass rounded-lg">
              <div className="flex justify-between text-sm">
                <span className="text-foreground/60">Price per token</span>
                <span>{formatCurrency(pricePerToken)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-foreground/60">Tokens you'll receive</span>
                <span>≈ {tokensToReceive.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold pt-2 border-t border-white/10">
                <span>Total</span>
                <span>{formatCurrency(usdAmount)}</span>
              </div>
            </div>
          )}

          <Button
            onClick={handleBuy}
            disabled={!amount || parseFloat(amount) <= 0}
            className="w-full"
            variant="neon"
          >
            Buy Tokens
          </Button>
        </CardContent>
      </Card>
    </>
  );
}

