"use client";

import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useState } from "react";
import { CONTRACT_ADDRESSES } from "@/lib/wagmi";

// Simplified Marketplace ABI
const marketplaceAbi = [
  {
    inputs: [
      { name: "propertyId", type: "uint256" },
      { name: "amount", type: "uint256" },
      { name: "price", type: "uint256" },
    ],
    name: "placeBuyOrder",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { name: "propertyId", type: "uint256" },
      { name: "amount", type: "uint256" },
      { name: "price", type: "uint256" },
    ],
    name: "placeSellOrder",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export function useMarketplace() {
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();
  
  const { writeContract, data, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: data,
  });

  const placeBuyOrder = async (
    propertyId: bigint,
    amount: bigint,
    price: bigint,
    value?: bigint
  ): Promise<void> => {
    try {
      writeContract({
        address: CONTRACT_ADDRESSES.MARKETPLACE as `0x${string}`,
        abi: marketplaceAbi,
        functionName: "placeBuyOrder",
        args: [propertyId, amount, price],
        value,
      });
    } catch (err) {
      console.error("Error placing buy order:", err);
      throw err;
    }
  };

  const placeSellOrder = async (
    propertyId: bigint,
    amount: bigint,
    price: bigint
  ): Promise<void> => {
    try {
      writeContract({
        address: CONTRACT_ADDRESSES.MARKETPLACE as `0x${string}`,
        abi: marketplaceAbi,
        functionName: "placeSellOrder",
        args: [propertyId, amount, price],
      });
    } catch (err) {
      console.error("Error placing sell order:", err);
      throw err;
    }
  };

  return {
    placeBuyOrder,
    placeSellOrder,
    txHash: data || txHash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

