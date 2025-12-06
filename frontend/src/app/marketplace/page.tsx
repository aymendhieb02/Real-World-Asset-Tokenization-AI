"use client";

import { useQuery } from "@tanstack/react-query";
import { getOrders, getTrades } from "@/lib/api/mock-market";
import { OrderBook } from "@/components/marketplace/order-book";
import { PlaceOrderForm } from "@/components/marketplace/place-order-form";
import { RecentTradesTable } from "@/components/marketplace/recent-trades-table";
import { MarketDepthChart } from "@/components/marketplace/market-depth-chart";
import { MainLayout } from "@/components/layout/main-layout";
import { NetworkSwitchWarning } from "@/components/web3/network-switch-warning";

export default function MarketplacePage() {
  const { data: orders } = useQuery({
    queryKey: ["orders"],
    queryFn: () => getOrders(),
  });

  const { data: trades } = useQuery({
    queryKey: ["trades"],
    queryFn: () => getTrades(),
  });

  return (
    <MainLayout showSidebar role="investor">
      <div className="container mx-auto px-4 py-8">
        <NetworkSwitchWarning />
        <h1 className="text-4xl font-bold mb-8">Marketplace</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 space-y-6">
            <OrderBook orders={orders || []} />
            <MarketDepthChart orders={orders || []} />
            <RecentTradesTable trades={trades || []} />
          </div>
          <div>
            <PlaceOrderForm propertyId="1" currentPrice={1.05} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

