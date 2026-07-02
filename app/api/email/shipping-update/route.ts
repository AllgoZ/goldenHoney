import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/resend'
import type { FSOrder } from '@/types/firebase'

interface ShippingPayload {
  order:          FSOrder
  trackingNumber: string
}

function fmt(n: number) {
  return '₹' + n.toLocaleString('en-IN')
}

function buildShippingHtml(order: FSOrder, trackingNumber: string): string {
  const addr = order.shippingAddress
  const itemSummary = order.items.map((item) =>
    `<tr>
      <td style="padding:10px 8px;border-bottom:1px solid #f0e9d6;font-size:14px;color:#1a1a1a;">${item.productName}</td>
      <td style="padding:10px 8px;border-bottom:1px solid #f0e9d6;font-size:14px;color:#666;text-align:center;">${item.selectedWeight} × ${item.quantity}</td>
      <td style="padding:10px 8px;border-bottom:1px solid #f0e9d6;font-size:14px;font-weight:600;color:#1a1a1a;text-align:right;">${fmt(item.lineTotal)}</td>
    </tr>`
  ).join('')

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#fdf8ef;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:600px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

    <!-- Header -->
    <div style="background:#f6c453;padding:28px 32px;text-align:center;">
      <p style="margin:0;font-size:22px;font-weight:800;letter-spacing:1px;color:#1a1a1a;">🍯 GOLDEN HONEY</p>
      <p style="margin:6px 0 0;font-size:13px;color:#7a5a00;font-weight:500;">Your order is on its way!</p>
    </div>

    <!-- Hero line -->
    <div style="background:#fffbf0;padding:24px 32px;text-align:center;border-bottom:1px solid #f0e9d6;">
      <p style="margin:0;font-size:28px;">🚚</p>
      <h1 style="margin:8px 0 4px;font-size:20px;font-weight:700;color:#1a1a1a;">Your package has shipped!</h1>
      <p style="margin:0;font-size:14px;color:#666;">Hi ${order.userName?.split(' ')[0] || 'there'}, your Golden Honey order is on its way to you.</p>
    </div>

    <div style="padding:28px 32px;">

      <!-- Order info -->
      <div style="display:flex;justify-content:space-between;margin-bottom:24px;">
        <div>
          <p style="margin:0;font-size:12px;color:#999;text-transform:uppercase;letter-spacing:.5px;font-weight:600;">Order</p>
          <p style="margin:4px 0 0;font-size:15px;font-weight:700;color:#1a1a1a;">${order.orderNumber}</p>
        </div>
      </div>

      <!-- Tracking box -->
      <div style="background:#fffbf0;border:2px solid #f6c453;border-radius:12px;padding:20px 24px;text-align:center;margin-bottom:24px;">
        <p style="margin:0;font-size:12px;color:#999;text-transform:uppercase;letter-spacing:.5px;font-weight:600;">Tracking Number</p>
        <p style="margin:8px 0 0;font-size:24px;font-weight:800;letter-spacing:2px;color:#1a1a1a;font-family:monospace;">${trackingNumber}</p>
        <p style="margin:8px 0 0;font-size:13px;color:#999;">Use this number on your courier's website to track your package.</p>
      </div>

      <!-- Items -->
      <h3 style="margin:0 0 12px;font-size:13px;font-weight:700;color:#999;letter-spacing:.5px;text-transform:uppercase;">Items in this shipment</h3>
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr style="background:#fdf8ef;">
            <th style="padding:10px 8px;text-align:left;font-size:12px;color:#999;font-weight:600;border-bottom:2px solid #f0e9d6;">Product</th>
            <th style="padding:10px 8px;text-align:center;font-size:12px;color:#999;font-weight:600;border-bottom:2px solid #f0e9d6;">Size × Qty</th>
            <th style="padding:10px 8px;text-align:right;font-size:12px;color:#999;font-weight:600;border-bottom:2px solid #f0e9d6;">Total</th>
          </tr>
        </thead>
        <tbody>${itemSummary}</tbody>
      </table>
      <div style="display:flex;justify-content:space-between;margin-top:12px;padding-top:12px;border-top:2px solid #f0e9d6;">
        <span style="font-size:15px;font-weight:700;color:#1a1a1a;">Order Total</span>
        <span style="font-size:15px;font-weight:700;color:#f6c453;">${fmt(order.total)}</span>
      </div>

      <!-- Delivery address -->
      <h3 style="margin:24px 0 12px;font-size:13px;font-weight:700;color:#999;letter-spacing:.5px;text-transform:uppercase;">Delivering to</h3>
      <p style="margin:0;font-size:14px;color:#1a1a1a;line-height:1.8;">
        ${addr.fullName}<br>
        ${addr.addressLine1}${addr.addressLine2 ? '<br>' + addr.addressLine2 : ''}<br>
        ${addr.city}, ${addr.state} — ${addr.pincode}
      </p>

      <!-- Note -->
      <div style="margin-top:28px;padding:16px;background:#fdf8ef;border-radius:10px;text-align:center;">
        <p style="margin:0;font-size:13px;color:#666;line-height:1.6;">
          Questions about your order? Reply to this email or reach us at<br>
          <a href="mailto:kodaigoldenhoney@gmail.com" style="color:#b8860b;font-weight:600;">kodaigoldenhoney@gmail.com</a>
          &nbsp;|&nbsp;
          <a href="https://wa.me/919159543104" style="color:#b8860b;font-weight:600;">WhatsApp</a>
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="background:#fdf8ef;padding:16px 32px;text-align:center;border-top:1px solid #f0e9d6;">
      <p style="margin:0;font-size:12px;color:#bbb;">© Golden Honey · Pure, raw, and delivered with care.</p>
    </div>
  </div>
</body>
</html>`
}

export async function POST(req: NextRequest) {
  try {
    const { order, trackingNumber }: ShippingPayload = await req.json()

    if (!order.userEmail) {
      return NextResponse.json({ ok: true, skipped: 'no customer email' })
    }

    await sendEmail({
      to:      order.userEmail,
      subject: `Your Golden Honey order ${order.orderNumber} has shipped`,
      html:    buildShippingHtml(order, trackingNumber),
    })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[email/shipping-update]', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
