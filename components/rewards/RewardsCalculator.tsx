'use client';

import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

const RewardsCalculator: React.FC = () => {
    const { address } = useAccount();
    const [timeSpent, setTimeSpent] = useState(0);
    const [rewardDistributed, setRewardDistributed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [txHash, settxHash] = useState<string | null>(null);
    const [signedMessage, setSignedMessage] = useState<string>('');

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeSpent(prevTime => prevTime + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (timeSpent >= 20 && !rewardDistributed) {
            distributeReward();
        }
    }, [timeSpent, rewardDistributed]);

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
        <div>
            <h1>Rewards Calculator</h1>
            {!rewardDistributed && <p>Time spent on page: {timeSpent} seconds</p>}
            {loading && <p>Loading...</p>}
            {rewardDistributed && (
                <div>
                    <p>Reward has been distributed!</p>
                    {txHash && (
                        <p>
                            Check transaction on Etherscan: <a href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer">{txHash}</a>
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default RewardsCalculator;