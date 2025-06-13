// main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { WagmiConfig } from 'wagmi';
import App from './components/App'; // 👈 якщо App.tsx лежить у components
import { config } from './lib/web3'; // 👈 твоя wagmi конфігурація

ReactDOM.createRoot(document.getElementById('app')!).render(
  <React.StrictMode>
    <WagmiConfig config={config}>
      <App />
    </WagmiConfig>
  </React.StrictMode>
);

