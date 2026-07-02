import { NextRequest, NextResponse } from 'next/server'
import { sendEmail, ADMIN_TO } from '@/lib/resend'
import type { FSOrder } from '@/types/firebase'

function fmt(n: number) {
  return '₹' + n.toLocaleString('en-IN')
}

function buildAdminHtml(order: FSOrder): string {
  const date = order.createdAt
    ? new Date((order.createdAt as unknown as { seconds: number }).seconds * 1000).toLocaleString('en-IN')
    : new Date().toLocaleString('en-IN')

  const addr = order.shippingAddress
  const itemRows = order.items.map((item) => `
    <tr>
      <td style="padding:10px 8px;border-bottom:1px solid #f0e9d6;font-size:14px;color:#1a1a1a;">${item.productName}</td>
      <td style="padding:10px 8px;border-bottom:1px solid #f0e9d6;font-size:14px;color:#666;text-align:center;">${item.selectedWeight}</td>
      <td style="padding:10px 8px;border-bottom:1px solid #f0e9d6;font-size:14px;color:#666;text-align:center;">${item.quantity}</td>
      <td style="padding:10px 8px;border-bottom:1px solid #f0e9d6;font-size:14px;color:#1a1a1a;text-align:right;font-weight:600;">${fmt(item.lineTotal)}</td>
    </tr>`).join('')

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#fdf8ef;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:600px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

    <!-- Header -->
    <div style="background:#f6c453;padding:28px 32px;text-align:center;">
      <p style="margin:0;font-size:22px;font-weight:800;letter-spacing:1px;color:#1a1a1a;">🍯 GOLDEN HONEY</p>
      <p style="margin:6px 0 0;font-size:13px;color:#7a5a00;font-weight:500;">New Order Received</p>
    </div>

    <!-- Order banner -->
    <div style="background:#fffbf0;border-bottom:1px solid #f0e9d6;padding:18px 32px;display:flex;justify-content:space-between;align-items:center;">
      <div>
        <p style="margin:0;font-size:18px;font-weight:700;color:#1a1a1a;">${order.orderNumber}</p>
        <p style="margin:4px 0 0;font-size:12px;color:#999;">${date}</p>
      </div>
      <div style="text-align:right;">
        <span style="background:#d1fae5;color:#065f46;font-size:12px;font-weight:600;padding:4px 12px;border-radius:99px;">${order.paymentStatus.toUpperCase()}</span>
        <br>
        <span style="background:#fef3c7;color:#92400e;font-size:12px;font-weight:600;padding:4px 12px;border-radius:99px;margin-top:4px;display:inline-block;">${order.orderStatus.toUpperCase()}</span>
      </div>
    </div>

    <div style="padding:28px 32px;">

      <!-- Customer -->
      <h3 style="margin:0 0 12px;font-size:13px;font-weight:700;color:#999;letter-spacing:.5px;text-transform:uppercase;">Customer</h3>
      <p style="margin:0;font-size:15px;font-weight:600;color:#1a1a1a;">${order.userName}</p>
      <p style="margin:3px 0 0;font-size:14px;color:#666;">${order.userPhone}${order.userEmail ? ` · ${order.userEmail}` : ''}</p>

      <!-- Shipping address -->
      <h3 style="margin:24px 0 12px;font-size:13px;font-weight:700;color:#999;letter-spacing:.5px;text-transform:uppercase;">Delivery Address</h3>
      <p style="margin:0;font-size:14px;color:#1a1a1a;line-height:1.7;">
        ${addr.fullName}<br>
        ${addr.addressLine1}${addr.addressLine2 ? '<br>' + addr.addressLine2 : ''}<br>
        ${addr.city}, ${addr.state} — ${addr.pincode}<br>
        📞 ${addr.phone}
      </p>
      ${order.deliveryNotes ? `<p style="margin:8px 0 0;font-size:13px;color:#999;font-style:italic;">Note: ${order.deliveryNotes}</p>` : ''}

      <!-- Items table -->
      <h3 style="margin:24px 0 12px;font-size:13px;font-weight:700;color:#999;letter-spacing:.5px;text-transform:uppercase;">Items Ordered</h3>
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr style="background:#fdf8ef;">
            <th style="padding:10px 8px;text-align:left;font-size:12px;color:#999;font-weight:600;border-bottom:2px solid #f0e9d6;">Product</th>
            <th style="padding:10px 8px;text-align:center;font-size:12px;color:#999;font-weight:600;border-bottom:2px solid #f0e9d6;">Size</th>
            <th style="padding:10px 8px;text-align:center;font-size:12px;color:#999;font-weight:600;border-bottom:2px solid #f0e9d6;">Qty</th>
            <th style="padding:10px 8px;text-align:right;font-size:12px;color:#999;font-weight:600;border-bottom:2px solid #f0e9d6;">Total</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
      </table>

      <!-- Totals -->
      <div style="margin-top:20px;border-top:2px solid #f0e9d6;padding-top:16px;">
        <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
          <span style="font-size:14px;color:#666;">Subtotal</span>
          <span style="font-size:14px;color:#1a1a1a;">${fmt(order.subtotal)}</span>
        </div>
        ${order.discount > 0 ? `<div style="display:flex;justify-content:space-between;margin-bottom:8px;">
          <span style="font-size:14px;color:#059669;">Discount${order.couponCode ? ` (${order.couponCode})` : ''}</span>
          <span style="font-size:14px;color:#059669;">− ${fmt(order.discount)}</span>
        </div>` : ''}
        <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
          <span style="font-size:14px;color:#666;">Shipping</span>
          <span style="font-size:14px;color:#1a1a1a;">${order.shipping === 0 ? 'Free' : fmt(order.shipping)}</span>
        </div>
        ${order.tax > 0 ? `<div style="display:flex;justify-content:space-between;margin-bottom:8px;">
          <span style="font-size:14px;color:#666;">Tax</span>
          <span style="font-size:14px;color:#1a1a1a;">${fmt(order.tax)}</span>
        </div>` : ''}
        <div style="display:flex;justify-content:space-between;margin-top:12px;padding-top:12px;border-top:2px solid #f0e9d6;">
          <span style="font-size:17px;font-weight:700;color:#1a1a1a;">Total</span>
          <span style="font-size:17px;font-weight:700;color:#f6c453;">${fmt(order.total)}</span>
        </div>
      </div>

      <!-- Payment ref -->
      <div style="margin-top:20px;background:#fdf8ef;border-radius:10px;padding:14px 16px;">
        <p style="margin:0;font-size:12px;color:#999;font-weight:600;text-transform:uppercase;letter-spacing:.5px;">Payment</p>
        <p style="margin:4px 0 0;font-size:14px;color:#1a1a1a;">
          ${order.paymentMethod === 'razorpay' ? 'Razorpay' : 'Cash on Delivery'}
          ${order.razorpayPaymentId ? ` · <span style="font-family:monospace;">${order.razorpayPaymentId}</span>` : ''}
        </p>
      </div>

    </div>

    <!-- Footer -->
    <div style="background:#fdf8ef;padding:16px 32px;text-align:center;border-top:1px solid #f0e9d6;">
      <p style="margin:0;font-size:12px;color:#bbb;">This is an automated notification from Golden Honey admin system.</p>
    </div>
  </div>
</body>
</html>`
}

export async function POST(req: NextRequest) {
  try {
    const order: FSOrder = await req.json()
    await sendEmail({
      to:      ADMIN_TO,
      subject: `New Order ${order.orderNumber} — ${fmt(order.total)}`,
      html:    buildAdminHtml(order),
    })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[email/order-placed]', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
