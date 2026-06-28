import { formatDate } from '@/lib/utils'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="font-heading font-semibold text-xl text-onyx mb-4">{title}</h2>
      <div className="text-onyx/65 text-sm leading-relaxed space-y-3">{children}</div>
    </section>
  )
}

export const metadata = { title: 'Privacy Policy — GOLDEN HONEY' }

export default function PrivacyPolicyPage() {
  return (
    <main className="pt-24 pb-20 min-h-screen bg-parchment">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="mb-10">
          <h1 className="font-heading font-bold text-4xl text-onyx mb-2">Privacy Policy</h1>
          <p className="text-sm text-onyx/40">Last updated: {formatDate('2026-01-01')}</p>
        </div>

        <div className="bg-white rounded-xl p-8 sm:p-10 border border-black/5 shadow-sm">
          <Section title="1. Information We Collect">
            <p>When you make a purchase or create an account, we collect: your name, email address, phone number, and delivery address. We also collect payment information, but this is processed directly by our payment partners and we never store card details.</p>
            <p>We automatically collect certain technical information including your IP address, browser type, device information, and pages visited, using standard web analytics tools.</p>
          </Section>

          <Section title="2. How We Use Your Information">
            <p>We use your information to process and deliver your orders, send order confirmations and updates, respond to your enquiries, and send marketing communications (only if you opt in).</p>
            <p>We do not sell, rent, or trade your personal information to third parties for their marketing purposes.</p>
          </Section>

          <Section title="3. Cookies">
            <p>We use essential cookies to operate our website and optional analytics cookies to understand how visitors use our site. You can manage cookie preferences in your browser settings. Disabling essential cookies may prevent some features from working.</p>
          </Section>

          <Section title="4. Data Retention">
            <p>We retain your account data for as long as your account is active, and for up to 7 years after account closure for accounting and legal compliance purposes. You may request deletion of your data at any time.</p>
          </Section>

          <Section title="5. Your Rights">
            <p>Under applicable data protection laws, you have the right to: access your personal data, correct inaccurate data, request deletion of your data, opt out of marketing communications at any time. To exercise these rights, contact us at privacy@goldenhoney.in.</p>
          </Section>

          <Section title="6. Security">
            <p>We implement industry-standard security measures including SSL encryption, secure data storage, and regular security audits. However, no method of transmission over the internet is 100% secure.</p>
          </Section>

          <Section title="7. Contact">
            <p>For privacy-related questions, contact our Privacy Officer at privacy@goldenhoney.in or write to us at 14, Neem Tree Lane, Koramangala, Bengaluru – 560095.</p>
          </Section>
        </div>
      </div>
    </main>
  )
}
