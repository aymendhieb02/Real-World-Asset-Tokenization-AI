"use client";

import { useAccount, useReadContract } from "wagmi";
import { formatUnits } from "viem";

// ERC-20 ABI for balanceOf
const erc20Abi = [
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export function useTokenBalance(tokenAddress?: `0x${string}`, decimals = 18) {
  const { address } = useAccount();

  const { data: balance, ...rest } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!tokenAddress,
    },
  });

  return {
    balance: balance ? parseFloat(formatUnits(balance, decimals)) : 0,
    rawBalance: balance,
    ...rest,
  };
}

