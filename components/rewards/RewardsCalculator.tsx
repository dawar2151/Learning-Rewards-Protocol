'use client';

import { Button } from '@headlessui/react';
import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

const RewardsCalculator: React.FC = () => {
    const { address } = useAccount();
    const [timeSpent, setTimeSpent] = useState(0);
    const [rewardDistributed, setRewardDistributed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [txHash, settxHash] = useState<string | null>(null);
    const [readingTime] = useState<number>(120);
    const [signedMessage] = useState<string>('');

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeSpent(prevTime => prevTime + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, []);


    const distributeReward = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ address, signedMessage }),
            });
            if (response.ok) {
                const data = await response.json();
                settxHash(data.txHash);
                setRewardDistributed(true);
                //alert('Reward distributed successfully!');
            }
        } catch (error) {
            console.error('Error distributing reward:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-h-90">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">Rewards Calculator</h1>
        {timeSpent <  readingTime && <p className="text-xl text-gray-600"> Reading Time Spent: {Math.floor(timeSpent / 60)} minutes {timeSpent % 60} seconds</p>}
       
        {loading && <p className="text-xl text-gray-600">Loading...</p>}
        {rewardDistributed && (
          <div>
            <p className="text-xl text-green-600">Reward has been distributed!</p>
            {txHash && (
              <p className="text-xl text-blue-600">
                Check transaction on Etherscan: <a href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer">{txHash}</a>
              </p>
            )}
          </div>
        )}
        {timeSpent >= readingTime && !loading && (
          <Button
            onClick={distributeReward}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"          >
            Cleam Rewards
          </Button>
        )}
      </div>
    </div>
    );
};

export default RewardsCalculator;