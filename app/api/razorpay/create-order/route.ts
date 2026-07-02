import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { amount } = await req.json()

  if (!amount || typeof amount !== 'number' || amount < 100) {
    return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
  }

  const keyId     = process.env.RAZORPAY_KEY_ID!
  const keySecret = process.env.RAZORPAY_KEY_SECRET!
  const auth      = Buffer.from(`${keyId}:${keySecret}`).toString('base64')

  const res = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Basic ${auth}`,
    },
    body: JSON.stringify({
      amount,
      currency: 'INR',
      receipt:  `gh_${Date.now()}`,
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    return NextResponse.json(
      { error: (err as any).error?.description ?? 'Order creation failed' },
      { status: 500 }
    )
  }

  const order = await res.json()
  return NextResponse.json({ id: order.id, amount: order.amount, currency: order.currency })
}
