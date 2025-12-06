import { Order, Trade } from "@/types";

export const mockOrders: Order[] = [
  {
    id: "1",
    propertyId: "1",
    type: "buy",
    price: 1.05,
    amount: 1000,
    total: 1050,
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    status: "pending",
  },
  {
    id: "2",
    propertyId: "1",
    type: "sell",
    price: 1.08,
    amount: 500,
    total: 540,
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    status: "pending",
  },
  {
    id: "3",
    propertyId: "2",
    type: "buy",
    price: 1.02,
    amount: 2000,
    total: 2040,
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    status: "pending",
  },
];

export const mockTrades: Trade[] = [
  {
    id: "1",
    propertyId: "1",
    type: "buy",
    price: 1.03,
    amount: 500,
    total: 515,
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    buyer: "0x1111111111111111111111111111111111111111",
    seller: "0x2222222222222222222222222222222222222222",
    txHash: "0xabc123...",
  },
  {
    id: "2",
    propertyId: "1",
    type: "sell",
    price: 1.04,
    amount: 250,
    total: 260,
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    buyer: "0x3333333333333333333333333333333333333333",
    seller: "0x1111111111111111111111111111111111111111",
    txHash: "0xdef456...",
  },
  {
    id: "3",
    propertyId: "2",
    type: "buy",
    price: 1.01,
    amount: 1000,
    total: 1010,
    timestamp: new Date(Date.now() - 10800000).toISOString(),
    buyer: "0x4444444444444444444444444444444444444444",
    seller: "0x5555555555555555555555555555555555555555",
    txHash: "0xghi789...",
  },
];

export async function getOrders(propertyId?: string): Promise<Order[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  if (propertyId) {
    return mockOrders.filter((o) => o.propertyId === propertyId);
  }
  return mockOrders;
}

export async function getTrades(propertyId?: string): Promise<Trade[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  if (propertyId) {
    return mockTrades.filter((t) => t.propertyId === propertyId);
  }
  return mockTrades;
}

