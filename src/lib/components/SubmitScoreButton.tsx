'use client';

import React from 'react';
import { writeContract } from '@wagmi/core';
import { leaderboardContract } from '../lib/contractClient';

export function SubmitScoreButton() {
  const submit = async () => {
    try {
      const player = (document.getElementById('playerName') as HTMLInputElement)?.value || 'Anonymous';
      const score = 100; // або динамічне значення з гри

      await writeContract({
        address: leaderboardContract.address,
        abi: leaderboardContract.abi,
        functionName: 'submitScore',
        args: [player, BigInt(score)]
      });

      alert('✅ Score submitted!');
    } catch (err) {
      console.error('❌ Error submitting score:', err);
    }
  };

  return (
    <button onClick={submit}>Submit Score</button>
  );
}
