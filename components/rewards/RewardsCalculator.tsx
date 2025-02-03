'use client'

import { Button } from '@headlessui/react'
import React, { useEffect, useState } from 'react'
import { useAccount, useSignMessage } from 'wagmi'

const RewardsCalculator: React.FC = () => {
  const { address } = useAccount()
  const [timeSpent, setTimeSpent] = useState(0)
  const [rewardDistributed, setRewardDistributed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [txHash, settxHash] = useState<string | null>(null)
  const [readingTime] = useState<number>(10)
  const [signedMessage] = useState<string>('')
  const { signMessageAsync } = useSignMessage()

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent((prevTime) => prevTime + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const distributeReward = async () => {
    setLoading(true)
    try {
      const message = 'claim rewards ' + new Date().getTime()
      const signature = await signMessageAsync({
        account: address,
        message,
      })
      if (signature) {
        const response = await fetch('/api/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ address, signature, message }),
        })
        if (response.ok) {
          const data = await response.json()
          settxHash(data.txHash)
          setRewardDistributed(true)
          //alert('Reward distributed successfully!');
        }
      }
    } catch (error) {
      console.error('Error distributing reward:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="max-h-90 w-full rounded-lg bg-white p-6 shadow-md">
        <h1 className="mb-4 text-2xl font-semibold text-gray-800">Rewards Calculator</h1>
        {timeSpent < readingTime && (
          <p className="text-xl text-gray-600">
            {' '}
            Reading Time Spent: {Math.floor(timeSpent / 60)} minutes {timeSpent % 60} seconds
          </p>
        )}

        {loading && <p className="text-xl text-gray-600">Cleaming Rewards, please wait...</p>}
        {rewardDistributed && (
          <div>
            <p className="text-xl text-green-600">Reward has been distributed!</p>
            {txHash && (
              <p className="text-l text-blue-600">
                Check transaction on Etherscan:{' '}
                <a
                  href={`https://sepolia.etherscan.io/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {txHash}
                </a>
              </p>
            )}
          </div>
        )}
        {timeSpent >= readingTime && !loading && !rewardDistributed && (
          <Button
            onClick={distributeReward}
            className="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Cleam Rewards
          </Button>
        )}
      </div>
    </div>
  )
}

export default RewardsCalculator
