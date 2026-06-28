import { formatDate } from '@/lib/utils'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="font-heading font-semibold text-xl text-onyx mb-4">{title}</h2>
      <div className="text-onyx/65 text-sm leading-relaxed space-y-3">{children}</div>
    </section>
  )
}

export const metadata = { title: 'Shipping Policy — GOLDEN HONEY' }

export default function ShippingPolicyPage() {
  return (
    <main className="pt-24 pb-20 min-h-screen bg-parchment">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="mb-10">
          <h1 className="font-heading font-bold text-4xl text-onyx mb-2">Shipping Policy</h1>
          <p className="text-sm text-onyx/40">Last updated: {formatDate('2026-01-01')}</p>
        </div>

        <div className="bg-white rounded-xl p-8 sm:p-10 border border-black/5 shadow-sm">
          <Section title="Shipping Rates">
            <div className="overflow-hidden rounded-xl border border-black/5">
              <table className="w-full text-sm">
                <thead className="bg-cream">
                  <tr>
                    <th className="text-left p-3 font-semibold text-onyx">Order Value</th>
                    <th className="text-left p-3 font-semibold text-onyx">Standard (3–5 days)</th>
                    <th className="text-left p-3 font-semibold text-onyx">Express (1–2 days)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-black/5">
                    <td className="p-3">Below ₹999</td>
                    <td className="p-3">₹79</td>
                    <td className="p-3">₹149</td>
                  </tr>
                  <tr className="border-t border-black/5 bg-cream/50">
                    <td className="p-3">₹999 and above</td>
                    <td className="p-3 text-green-600 font-medium">FREE</td>
                    <td className="p-3">₹149</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Section>

          <Section title="Processing Time">
            <p>Orders are typically processed within 1-2 business days. Gift sets, personalised items, and orders placed during sale periods may require an additional 1-2 days.</p>
            <p>You will receive an email with your tracking number once your order has been dispatched.</p>
          </Section>

          <Section title="Delivery Partners">
            <p>We ship across India via Delhivery, Blue Dart, and DTDC. The courier is selected based on your delivery location to ensure the fastest and safest delivery. For Manuka honey and rare varieties, we use temperature-controlled packaging where required.</p>
          </Section>

          <Section title="Tracking Your Order">
            <p>You'll receive a tracking link via email and SMS once your order is dispatched. You can also track your order on our Track Order page using your order number.</p>
          </Section>

          <Section title="Delivery Issues">
            <p>If your order hasn't arrived within the estimated timeframe, please contact us at hello@goldenhoney.in with your order number. We'll investigate with the courier and resolve the issue promptly.</p>
            <p>If a delivery attempt is unsuccessful, the courier will try again the next working day. After two failed attempts, the package will be returned to us and we'll contact you to arrange re-delivery (additional charges may apply).</p>
          </Section>

          <Section title="International Shipping">
            <p>We currently ship only within India. International shipping is planned for 2026-2027. Please sign up for our newsletter to be notified when international delivery becomes available for your country.</p>
          </Section>
        </div>
      </div>
    </main>
  )
}
