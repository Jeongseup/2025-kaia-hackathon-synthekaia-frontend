// Counter Contract ABI and Address
export const COUNTER_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_COUNTER_CONTRACT_ADDRESS || "";

export const COUNTER_CONTRACT_ABI = [
  // Counter functions
  "function number() view returns (uint256)",
  "function increment()",
  "function setNumber(uint256 newNumber)",
] as const;
