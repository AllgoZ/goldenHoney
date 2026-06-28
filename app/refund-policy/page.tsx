import { formatDate } from '@/lib/utils'
import Link from 'next/link'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="font-heading font-semibold text-xl text-onyx mb-4">{title}</h2>
      <div className="text-onyx/65 text-sm leading-relaxed space-y-3">{children}</div>
    </section>
  )
}

export const metadata = { title: 'Refund Policy — GOLDEN HONEY' }

export default function RefundPolicyPage() {
  return (
    <main className="pt-24 pb-20 min-h-screen bg-parchment">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="mb-10">
          <h1 className="font-heading font-bold text-4xl text-onyx mb-2">Refund Policy</h1>
          <p className="text-sm text-onyx/40">Last updated: {formatDate('2026-01-01')}</p>
        </div>

        <div className="bg-white rounded-xl p-8 sm:p-10 border border-black/5 shadow-sm">
          <p className="text-sm text-onyx/65 leading-relaxed mb-10">
            We want you to be completely happy with your purchase. If something isn't right, we'll make it right.
          </p>

          <Section title="Returns — Honey Products">
            <p>Unopened honey products in their original sealed packaging may be returned within 7 days of delivery for a full refund. To initiate a return, email us at returns@goldenhoney.in with your order number and reason.</p>
            <p><strong className="text-onyx">Crystallisation is not a defect.</strong> Raw honey naturally crystallises over time — this is a sign of quality. Crystallised honey returns are not accepted. To liquefy crystallised honey, place the jar in warm (not hot) water.</p>
            <p>Once opened, honey products cannot be returned unless there is a genuine quality issue, verified through photographs.</p>
          </Section>

          <Section title="Returns — Wooden Toys">
            <p>Wooden toys may be returned within 7 days of delivery if they are unused and in original packaging. If a toy arrives damaged or with a manufacturing defect, we will replace it at no cost within 24 hours of receiving photographic evidence.</p>
            <p>Minor variations in wood grain, colour, and texture are natural characteristics and are not considered defects.</p>
          </Section>

          <Section title="Damaged or Incorrect Items">
            <p>If your order arrives damaged, broken, or incorrect: photograph the item and packaging immediately. Email returns@goldenhoney.in within 48 hours of delivery. We will arrange a replacement or full refund within 24 hours — no need to return the item.</p>
          </Section>

          <Section title="Refund Process">
            <p>Approved refunds are processed within 2-3 business days. The amount will be credited back to your original payment method:</p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>UPI: 1-3 business days</li>
              <li>Credit/Debit Card: 5-7 business days</li>
              <li>Net Banking: 3-5 business days</li>
              <li>Store Credit: Instant (if preferred)</li>
            </ul>
          </Section>

          <Section title="Non-Returnable Items">
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Opened honey jars (unless defective)</li>
              <li>Personalised or engraved items</li>
              <li>Gift sets that have been partially opened</li>
              <li>Items returned after the 7-day window</li>
            </ul>
          </Section>

          <Section title="Contact Us">
            <p>
              For any return or refund queries, contact us at{' '}
              <a href="mailto:returns@goldenhoney.in" className="text-honey-dark hover:underline">returns@goldenhoney.in</a>{' '}
              or call +91 98765 43210. We're available Monday to Saturday, 9 AM – 6 PM IST.
            </p>
          </Section>
        </div>
      </div>
    </main>
  )
}
