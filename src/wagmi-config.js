import { createConfig, http } from 'wagmi'
import { injected } from 'wagmi/connectors'

// Monad Testnet configuration
export const monadTestnet = {
  id: 10143,
  name: 'Monad Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'MON',
    symbol: 'MON',
  },
  rpcUrls: {
    default: { http: ['https://testnet-rpc.monad.xyz'] },
    public: { http: ['https://testnet-rpc.monad.xyz'] },
  },
  blockExplorers: {
    default: { name: 'Monad Explorer', url: 'https://testnet.monadexplorer.com' },
  },
}

export const config = createConfig({
  chains: [monadTestnet],
  connectors: [
    injected(),
  ],
  transports: {
    [monadTestnet.id]: http(),
  },
  ssr: false, // Disable server-side rendering to avoid storage issues
}) 