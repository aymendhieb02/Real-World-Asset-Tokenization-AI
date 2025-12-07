import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { polygonAmoy } from "wagmi/chains";

// Use projectId from env or a dummy one (32 character hex string format)
// Note: Without a valid WalletConnect projectId, WalletConnect features won't work
// but the app will still function with other wallet connectors
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "00000000000000000000000000000000";

export const config = getDefaultConfig({
  appName: "NeuralEstate AI",
  projectId: projectId,
  chains: [polygonAmoy],
  ssr: true,
});

// Contract addresses (optional - for future blockchain integration)
export const CONTRACT_ADDRESSES = {
  KYC_REGISTRY: process.env.NEXT_PUBLIC_KYC_REGISTRY_ADDRESS || "0x0000000000000000000000000000000000000000",
  DIVIDEND_DISTRIBUTOR: process.env.NEXT_PUBLIC_DIVIDEND_DISTRIBUTOR_ADDRESS || "0x0000000000000000000000000000000000000000",
} as const;

