// src/lib/web3.ts

import { createConfig, configureChains } from '@wagmi/core'
import { publicProvider } from '@wagmi/core/providers/public'
import { WalletConnectConnector } from '@wagmi/core/connectors/walletConnect'
import { InjectedConnector } from '@wagmi/core/connectors/injected'
import { http } from 'viem'

// ⚠️ Використай свої параметри з Monad Testnet
const MONAD_CHAIN = {
  id: 10143,
  name: 'Monad Testnet',
  nativeCurrency: { name: 'MON', symbol: 'MON', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://monad-testnet.drpc.org'] },
  },
  blockExplorers: {
    default: { name: 'Monad Explorer', url: 'https://explorer.monad.xyz' },
  },
  testnet: true,
}

export const { chains, publicClient } = configureChains(
  [MONAD_CHAIN],
  [publicProvider()]
)

export const config = createConfig({
  autoConnect: true,
  connectors: [
    new InjectedConnector({ chains }), // MetaMask
    new WalletConnectConnector({
      chains,
      options: {
        projectId: 'demo', // 🔸 заміни на свій projectId з https://cloud.walletconnect.com/
        showQrModal: true,
      },
    }),
  ],
  publicClient,
})
