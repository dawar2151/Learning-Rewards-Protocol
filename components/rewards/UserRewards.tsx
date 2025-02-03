'use client'
import { formatUnits } from 'viem'
import { useAccount, useBalance } from 'wagmi'

const UserRewards = () => {
  const { address: userAddress } = useAccount()
  const tokenAddress = process.env.NEXT_PUBLIC_TOKEN_ADDRESS as `0x${string}` | undefined
  const data = useBalance({ address: userAddress, token: tokenAddress })

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100">
      <div className="max-h-90 w-full rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-2xl font-semibold text-gray-800">Your Earning of Growth Token</h2>
        {data.isLoading ? (
          <p className="text-xl text-gray-600">Loading balance...</p>
        ) : data.isError ? (
          <p className="text-xl text-red-600">Error fetching balance</p>
        ) : (
          <p className="text-xl text-green-600">
            {formatUnits(data.data?.value ?? BigInt(0), data.data?.decimals ?? 18)} GROWTH
          </p>
        )}
      </div>
    </div>
  )
}

export default UserRewards
