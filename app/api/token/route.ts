// app/api/token/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  const token = 'your-token-value'
  return NextResponse.json({ token })
}