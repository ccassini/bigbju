// src/components/Game.tsx
import React, { useEffect } from 'react';

export const Game: React.FC = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '/main.js'; // якщо main.js буде в public
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <div id="game-container" />;
};
