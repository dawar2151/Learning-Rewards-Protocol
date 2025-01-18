// app/api/token/route.ts
import { NextResponse } from 'next/server'
import { ethers } from 'ethers'


export async function GET() {
  const token = 'your-token-value'
  return NextResponse.json({ token })
}


export async function POST(request: Request) {
  try {
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL)

    const privateKey = process.env.PRIVATE_KEY
    const tokenAddress = process.env.TOKEN_ADDRESS
    if (!provider || !privateKey || !tokenAddress) {
      throw new Error('Missing environment variables')
    }
    const wallet = new ethers.Wallet(privateKey, provider)

    const abi = [
      // ERC20 ABI
      "function transfer(address to, uint amount) public returns (bool)"
    ]
    const contract = new ethers.Contract(tokenAddress, abi, wallet)

    const { address } = await request.json()
    const amount = ethers.parseUnits('1', 18) // 5 tokens with 18 decimals

    const tx = await contract.transfer(address, amount)
    await tx.wait()

    return NextResponse.json({ success: true, txHash: tx.hash })
  } catch (error) {
    console.error('Error distributing tokens:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}