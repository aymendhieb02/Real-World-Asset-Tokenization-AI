"use client";

import { useAccount, useChainId } from "wagmi";
import { polygonAmoy } from "wagmi/chains";
import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSwitchChain } from "wagmi";

export function NetworkSwitchWarning() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  if (!isConnected || chainId === polygonAmoy.id) {
    return null;
  }

  return (
    <div className="glass border border-yellow-500/30 rounded-lg p-4 mb-4 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <AlertTriangle className="text-yellow-500" size={20} />
        <div>
          <div className="font-semibold text-yellow-500">Wrong Network</div>
          <div className="text-sm text-foreground/70">
            Please switch to Polygon Amoy testnet
          </div>
        </div>
      </div>
      <Button
        onClick={() => switchChain({ chainId: polygonAmoy.id })}
        variant="outline"
        size="sm"
        className="border-yellow-500 text-yellow-500 hover:bg-yellow-500/10"
      >
        Switch Network
      </Button>
    </div>
  );
}

