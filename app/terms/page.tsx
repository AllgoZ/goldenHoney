import { formatDate } from '@/lib/utils'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="font-heading font-semibold text-xl text-onyx mb-4">{title}</h2>
      <div className="text-onyx/65 text-sm leading-relaxed space-y-3">{children}</div>
    </section>
  )
}

export const metadata = { title: 'Terms of Service — GOLDEN HONEY' }

export default function TermsPage() {
  return (
    <main className="pt-24 pb-20 min-h-screen bg-parchment">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="mb-10">
          <h1 className="font-heading font-bold text-4xl text-onyx mb-2">Terms of Service</h1>
          <p className="text-sm text-onyx/40">Last updated: {formatDate('2026-01-01')}</p>
        </div>

        <div className="bg-white rounded-xl p-8 sm:p-10 border border-black/5 shadow-sm">
          <Section title="1. Acceptance of Terms">
            <p>By accessing and using goldenhoney.in, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website or services.</p>
          </Section>

          <Section title="2. Products and Pricing">
            <p>All prices are listed in Indian Rupees (₹) and are inclusive of applicable taxes. We reserve the right to change prices at any time without notice. Price changes will not affect orders already placed and confirmed.</p>
            <p>Product images are for illustrative purposes. Minor variations in colour and texture are natural characteristics of raw honey and handcrafted wooden items and do not constitute a defect.</p>
          </Section>

          <Section title="3. Orders and Payment">
            <p>By placing an order, you represent that you are at least 18 years old and have the legal capacity to enter into a contract. Order confirmation does not guarantee product availability; we may cancel any order and provide a full refund if stock is unavailable.</p>
            <p>Payment must be made in full at the time of order. We accept UPI, credit/debit cards, net banking, and EMI options.</p>
          </Section>

          <Section title="4. Delivery">
            <p>Delivery timelines are estimates only. We are not liable for delays caused by courier partners, force majeure events, or circumstances beyond our control. Risk of loss and title pass to you upon delivery.</p>
          </Section>

          <Section title="5. Returns and Refunds">
            <p>Please see our Refund Policy for complete details. In general, unopened products in original packaging may be returned within 7 days. Certain products (opened honey jars, personalised items) may not be eligible for return.</p>
          </Section>

          <Section title="6. Limitation of Liability">
            <p>To the maximum extent permitted by law, GOLDEN HONEY shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our products or services.</p>
          </Section>

          <Section title="7. Governing Law">
            <p>These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Bengaluru, Karnataka.</p>
          </Section>

          <Section title="8. Contact">
            <p>Questions about these terms? Contact us at legal@goldenhoney.in.</p>
          </Section>
        </div>
      </div>
    </main>
  )
}
