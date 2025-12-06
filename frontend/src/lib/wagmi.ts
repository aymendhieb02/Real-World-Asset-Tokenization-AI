import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { polygonAmoy } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "NeuralEstate AI",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "your-project-id",
  chains: [polygonAmoy],
  ssr: true,
});

// Contract addresses (will be replaced with actual deployed addresses)
export const CONTRACT_ADDRESSES = {
  KYC_REGISTRY: process.env.NEXT_PUBLIC_KYC_REGISTRY_ADDRESS || "0x0000000000000000000000000000000000000000",
  MARKETPLACE: process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS || "0x0000000000000000000000000000000000000000",
  DIVIDEND_DISTRIBUTOR: process.env.NEXT_PUBLIC_DIVIDEND_DISTRIBUTOR_ADDRESS || "0x0000000000000000000000000000000000000000",
} as const;

