// pages/api/user.ts
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name?: string
  message?: string
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === 'GET') {
    // Handle GET request
    res.status(200).json({ name: 'John Doe' })
  } else if (req.method === 'POST') {
    // Handle POST request
    const { name } = req.body
    res.status(200).json({ message: `Hello, ${name}` })
  } else {
    // Handle other HTTP methods
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}