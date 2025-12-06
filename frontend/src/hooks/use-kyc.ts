"use client";

import { useAccount, useReadContract } from "wagmi";
import { CONTRACT_ADDRESSES } from "@/lib/wagmi";

// Simplified KYC Registry ABI
const kycAbi = [
  {
    inputs: [{ name: "user", type: "address" }],
    name: "isVerified",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "user", type: "address" }],
    name: "getKYCLevel",
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export function useKYC() {
  const { address } = useAccount();

  const { data: isVerified, ...rest } = useReadContract({
    address: CONTRACT_ADDRESSES.KYC_REGISTRY as `0x${string}`,
    abi: kycAbi,
    functionName: "isVerified",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  const { data: kycLevel } = useReadContract({
    address: CONTRACT_ADDRESSES.KYC_REGISTRY as `0x${string}`,
    abi: kycAbi,
    functionName: "getKYCLevel",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  return {
    isVerified: isVerified ?? false,
    kycLevel: kycLevel ? Number(kycLevel) : 0,
    ...rest,
  };
}

