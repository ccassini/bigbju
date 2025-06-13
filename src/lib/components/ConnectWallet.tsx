'use client';

import React from 'react';
import { useConnect } from 'wagmi';

export function ConnectWallet() {
  const { connect, connectors } = useConnect();

  return (
    <div>
      {connectors.map((connector) => (
        <button key={connector.id} onClick={() => connect({ connector })}>
          Connect with {connector.name}
        </button>
      ))}
    </div>
  );
}
