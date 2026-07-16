import Link from 'next/link'

const SHOP_LINKS = [
  { href: '/shop',          label: 'All Products' },
  { href: '/shop?cat=honey', label: 'Honey' },
  { href: '/shop?cat=rare',  label: 'Rare Collection' },
  { href: '/shop?cat=toys',  label: 'Wooden Toys' },
  { href: '/shop?cat=gifts', label: 'Gift Boxes' },
]

const HELP_LINKS = [
  { href: '/faq',              label: 'FAQ' },
  { href: '/track-order',      label: 'Track Your Order' },
  { href: '/shipping-policy',  label: 'Shipping Policy' },
  { href: '/refund-policy',    label: 'Refund Policy' },
  { href: '/contact',          label: 'Contact Us' },
]

const LEGAL_LINKS = [
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/terms',          label: 'Terms of Service' },
]

export default function Footer() {
  return (
    <footer className="bg-onyx text-white/70 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🍯</span>
              <span className="font-heading font-bold text-lg text-white tracking-tight">
                GOLDEN <span className="text-honey">HONEY</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-6">
              Pure raw honey and handcrafted wooden toys — sourced from nature,
              made with care. Free shipping above ₹999.
            </p>
            <div className="flex items-center gap-3">
              {['instagram', 'facebook', 'youtube'].map((s) => (
                <a
                  key={s}
                  href="#"
                  aria-label={s}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-honey/20 transition-colors flex items-center justify-center text-sm capitalize font-medium"
                >
                  {s[0].toUpperCase()}
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-heading font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Shop
            </h3>
            <ul className="space-y-2.5">
              {SHOP_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm hover:text-honey transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="font-heading font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Help
            </h3>
            <ul className="space-y-2.5">
              {HELP_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm hover:text-honey transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Contact
            </h3>
            <address className="not-italic text-sm space-y-2.5">
              <p>📧 kodaigoldenhoney@gmail.com</p>
              <p>📞 +91 91595 43104</p>
              <p>⏰ Mon–Sat, 9 AM – 6 PM IST</p>
              <p className="pt-1 leading-relaxed text-white/50">
                Oddanchatram, Dindigul – 624 619
              </p>
              <p className="leading-relaxed text-white/50">
                Malabar Bakes, near NH83<br />
                Periyakarattupatti, Oddanchatram – 624 614
              </p>
            </address>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <p>© {new Date().getFullYear()} GOLDEN HONEY. All Rights Reserved by <span className="text-white/60">ALLGOZ TECH</span>.</p>
          <div className="flex gap-4">
            {LEGAL_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-white/70 transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
