// app/api/token/route.ts
import { NextResponse } from 'next/server'
import { ethers } from 'ethers'

function verifyEnvVars() {
  const { RPC_URL, PRIVATE_KEY, TOKEN_ADDRESS } = process.env
  if (!RPC_URL || !PRIVATE_KEY || !TOKEN_ADDRESS) {
    throw new Error('Missing environment variables')
  }
  return { RPC_URL, PRIVATE_KEY, TOKEN_ADDRESS }
}

function createContract(tokenAddress: string, wallet: ethers.Wallet) {
  const abi = [
    // ERC20 ABI
    "function transfer(address to, uint amount) public returns (bool)",
  ]
  return new ethers.Contract(tokenAddress, abi, wallet)
}

export async function POST(request: Request) {
  try {
    const { RPC_URL, PRIVATE_KEY, TOKEN_ADDRESS } = verifyEnvVars()

    const provider = new ethers.JsonRpcProvider(RPC_URL)
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider)
    const contract = createContract(TOKEN_ADDRESS, wallet)

    const { address, signature, message } = await request.json()
    console.log('Distributing tokens to:', address)

    // Verify the signature
    const recoveredAddress = ethers.verifyMessage(message, signature)
    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      throw new Error('Signature verification failed')
    }

    const amount = ethers.parseUnits('1', 18) // For example, 1 token
    const tx = await contract.transfer(address, amount)
    await tx.wait()

    return NextResponse.json({ success: true, txHash: tx.hash })
  } catch (error) {
    console.error('Error distributing tokens:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}