import { createPublicClient, getContract, http } from 'viem';
import { config, chains } from './web3'; // твоя конфігурація wagmi
import { CONTRACT_ADDRESS, CONTRACT_ABI } from './contract';

// Використовуємо перший ланцюг (Monad Testnet)
const client = createPublicClient({
  chain: chains[0],
  transport: http()
});

export const leaderboardContract = getContract({
  address: CONTRACT_ADDRESS as `0x${string}`,
  abi: CONTRACT_ABI,
  client,
});
