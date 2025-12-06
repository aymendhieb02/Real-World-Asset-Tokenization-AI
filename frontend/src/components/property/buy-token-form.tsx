"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatCurrency, calculateSlippage } from "@/lib/utils";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { TransactionStatusModal } from "@/components/web3/transaction-status-modal";
import { useMarketplace } from "@/hooks/use-marketplace";

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
  reserveIn = 1000000,
  reserveOut = 1000000,
}: BuyTokenFormProps) {
  const { address, isConnected } = useAccount();
  const [amount, setAmount] = useState("");
  const [txStatus, setTxStatus] = useState<"pending" | "success" | "error">("pending");
  const [showModal, setShowModal] = useState(false);
  const { placeBuyOrder, isPending, isSuccess, txHash } = useMarketplace();

  // Update status when transaction succeeds
  if (isSuccess && txStatus === "pending") {
    setTxStatus("success");
  }

  const usdAmount = parseFloat(amount) * pricePerToken || 0;
  const outputAmount = amount ? calculateSlippage(usdAmount, reserveIn, reserveOut) : 0;
  const slippage = amount && usdAmount > 0 ? ((usdAmount - outputAmount) / usdAmount) * 100 : 0;

  const handleBuy = async () => {
    if (!amount || !isConnected) return;

    setShowModal(true);
    setTxStatus("pending");

    try {
      await placeBuyOrder(
        BigInt(propertyId),
        BigInt(parseFloat(amount) * 1e18),
        BigInt(pricePerToken * 1e18),
        BigInt(usdAmount * 1e18)
      );
      setTxStatus("pending");
    } catch (error) {
      console.error("Buy error:", error);
      setTxStatus("error");
    }
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
                <span>≈ {(outputAmount / pricePerToken).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-foreground/60">Estimated slippage</span>
                <span className={slippage > 1 ? "text-yellow-400" : "text-green-400"}>
                  {slippage.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between text-sm font-semibold pt-2 border-t border-white/10">
                <span>Total</span>
                <span>{formatCurrency(usdAmount)}</span>
              </div>
            </div>
          )}

          <Button
            onClick={handleBuy}
            disabled={!amount || isPending || parseFloat(amount) <= 0}
            className="w-full"
            variant="neon"
          >
            {isPending ? "Processing..." : "Buy Tokens"}
          </Button>
        </CardContent>
      </Card>

      <TransactionStatusModal
        open={showModal}
        onClose={() => setShowModal(false)}
        status={txStatus}
        txHash={txHash}
        message={
          txStatus === "success"
            ? "Your tokens have been purchased successfully!"
            : txStatus === "error"
            ? "Transaction failed. Please try again."
            : "Processing your transaction..."
        }
      />
    </>
  );
}

