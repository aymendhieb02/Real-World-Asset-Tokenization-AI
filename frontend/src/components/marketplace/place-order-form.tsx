"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency } from "@/lib/utils";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useMarketplace } from "@/hooks/use-marketplace";
import { TransactionStatusModal } from "@/components/web3/transaction-status-modal";

interface PlaceOrderFormProps {
  propertyId: string;
  currentPrice: number;
}

export function PlaceOrderForm({ propertyId, currentPrice }: PlaceOrderFormProps) {
  const { address, isConnected } = useAccount();
  const [orderType, setOrderType] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState(currentPrice.toString());
  const [txStatus, setTxStatus] = useState<"pending" | "success" | "error">("pending");
  const [showModal, setShowModal] = useState(false);
  const { placeBuyOrder, placeSellOrder, isPending, isSuccess, txHash } = useMarketplace();

  // Update status when transaction succeeds
  if (isSuccess && txStatus === "pending") {
    setTxStatus("success");
  }

  const total = parseFloat(amount) * parseFloat(price) || 0;

  const handlePlaceOrder = async () => {
    if (!amount || !price || !isConnected) return;

    setShowModal(true);
    setTxStatus("pending");

    try {
      if (orderType === "buy") {
        await placeBuyOrder(
          BigInt(propertyId),
          BigInt(parseFloat(amount) * 1e18),
          BigInt(parseFloat(price) * 1e18),
          BigInt(total * 1e18)
        );
      } else {
        await placeSellOrder(
          BigInt(propertyId),
          BigInt(parseFloat(amount) * 1e18),
          BigInt(parseFloat(price) * 1e18)
        );
      }
      setTxStatus("pending");
    } catch (error) {
      console.error("Order error:", error);
      setTxStatus("error");
    }
  };

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Place Order</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-foreground/70 mb-4">Connect your wallet to place orders</p>
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
          <CardTitle>Place Order</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={orderType} onValueChange={(v) => setOrderType(v as "buy" | "sell")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="buy">Buy</TabsTrigger>
              <TabsTrigger value="sell">Sell</TabsTrigger>
            </TabsList>

            <TabsContent value="buy" className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Amount (Tokens)</label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Price per Token (USD)</label>
                <Input
                  type="number"
                  placeholder="Enter price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
                <div className="text-xs text-foreground/60 mt-1">
                  Current price: {formatCurrency(currentPrice)}
                </div>
              </div>
              {total > 0 && (
                <div className="p-3 glass rounded-lg">
                  <div className="flex justify-between text-sm font-semibold">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
              )}
              <Button
                onClick={handlePlaceOrder}
                disabled={!amount || !price || isPending}
                className="w-full"
                variant="neon"
              >
                {isPending ? "Processing..." : "Place Buy Order"}
              </Button>
            </TabsContent>

            <TabsContent value="sell" className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Amount (Tokens)</label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Price per Token (USD)</label>
                <Input
                  type="number"
                  placeholder="Enter price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
                <div className="text-xs text-foreground/60 mt-1">
                  Current price: {formatCurrency(currentPrice)}
                </div>
              </div>
              {total > 0 && (
                <div className="p-3 glass rounded-lg">
                  <div className="flex justify-between text-sm font-semibold">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
              )}
              <Button
                onClick={handlePlaceOrder}
                disabled={!amount || !price || isPending}
                className="w-full"
                variant="outline"
              >
                {isPending ? "Processing..." : "Place Sell Order"}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <TransactionStatusModal
        open={showModal}
        onClose={() => setShowModal(false)}
        status={txStatus}
        txHash={txHash}
        message={
          txStatus === "success"
            ? `Your ${orderType} order has been placed successfully!`
            : txStatus === "error"
            ? "Order failed. Please try again."
            : "Processing your order..."
        }
      />
    </>
  );
}

