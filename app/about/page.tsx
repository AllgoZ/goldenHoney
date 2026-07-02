'use client'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Heart, Users, Droplets, Sprout, Mountain, CloudRain, Crown, ShieldCheck } from 'lucide-react'
import Button from '@/components/ui/Button'

const HERO_DESKTOP = 'https://images.unsplash.com/photo-1471943311424-646960669fbc?auto=format&fit=crop&w=1200&q=80'
const HERO_MOBILE  = '/wildhoney.webp'
const FOREST = 'https://res.cloudinary.com/dhjcr3vdl/image/upload/v1782993381/golden-honey/beekeeper.avif'

const H = ({ children }: { children: React.ReactNode }) => (
  <span className="text-honey font-semibold">{children}</span>
)

const VALUES = [
  {
    icon: <Users size={24} />,
    title: 'Sourced from Indigenous Hill Tribes',
    desc: <>Every variety is sourced directly from experienced <H>indigenous Hill Tribes</H> who have practised <H>traditional harvesting</H> for generations — ensuring authentic, sustainable honey.</>,
    taTitle: 'மலைவாழ் பழங்குடியினரிடமிருந்து நேரடி சேகரிப்பு',
    taDesc: 'எங்கள் தேன்கள் தலைமுறை அனுபவம் கொண்ட மலைவாழ் பழங்குடியினரிடமிருந்து நேரடியாக பெறப்படுகின்றன.',
  },
  {
    icon: <Droplets size={24} />,
    title: 'Naturally Pure & Minimally Processed',
    desc: <>Our honey is carefully filtered without excessive processing, preserving its <H>natural enzymes</H>, aroma, taste, and <H>nutritional goodness</H>.</>,
    taTitle: 'இயற்கை தன்மை பாதுகாக்கப்படுகிறது',
    taDesc: 'அதிகப்படியான செயலாக்கம் இல்லாமல், தேனின் இயற்கையான சுவை, மணம் மற்றும் ஊட்டச்சத்துகள் பாதுகாக்கப்படுகின்றன.',
  },
  {
    icon: <Sprout size={24} />,
    title: 'Natural Pollen Retention',
    desc: <>Unlike heavily processed commercial honey, our honey retains its naturally occurring <H>Pollen</H> — keeping it closer to honey in its most <H>natural form</H>.</>,
    taTitle: 'இயற்கையான மகரந்தம்',
    taDesc: 'எங்கள் தேனில் இயற்கையாக உள்ள மகரந்தம் (Pollen) பாதுகாக்கப்படுகிறது, தேன் அதன் இயல்பான தன்மையை தக்க வைத்திருக்கிறது.',
  },
  {
    icon: <Mountain size={24} />,
    title: 'Harvested from Pristine Hill Regions',
    desc: <>Collected from untouched forests including <H>Kodaikanal</H> and other high-altitude areas known for their rich biodiversity and clean environment.</>,
    taTitle: 'தூய்மையான மலைப்பகுதிகளில் இருந்து',
    taDesc: 'கொடைக்கானல் மற்றும் பிற உயரமான மலைப்பகுதிகளில் உள்ள இயற்கை வனப்பகுதிகளில் இருந்து தரமான தேன் சேகரிக்கப்படுகிறது.',
  },
  {
    icon: <CloudRain size={24} />,
    title: 'Rich Floral Diversity',
    desc: <>Abundant rainfall and diverse <H>wildflowers</H> in these hill regions contribute to the unique taste, aroma, and character of every batch.</>,
    taTitle: 'வளமான மலர்ச்சூழல்',
    taDesc: 'அதிக மழைப்பொழிவு மற்றும் பல்வேறு காட்டுமலர்களால் நிறைந்த பகுதிகள் தேனுக்கு தனித்துவமான சுவை மற்றும் மணம் வழங்குகின்றன.',
  },
  {
    icon: <Crown size={24} />,
    title: 'Premium Himalayan Honey',
    desc: <>Our <H>Himalayan Honey</H> is ethically sourced from the Nepal Himalayan region, where bees collect nectar from naturally growing <H>mountain flowers</H>.</>,
    taTitle: 'நேபாள இமயமலை தேன்',
    taDesc: 'நேபாள இமயமலைப் பகுதிகளில் இயற்கையாக வளரும் மலர்களிலிருந்து தேனீக்கள் சேகரிக்கும் தேன் நெறிமுறையுடன் பெறப்படுகிறது.',
  },
  {
    icon: <ShieldCheck size={24} />,
    title: 'Carefully Selected for Quality',
    desc: <>Every batch is carefully inspected to ensure <H>purity</H>, freshness, premium <H>Quality</H>, and complete customer satisfaction.</>,
    taTitle: 'உயர்தர தரக்கட்டுப்பாடு',
    taDesc: 'ஒவ்வொரு தொகுதியும் தூய்மை, புத்துணர்ச்சி மற்றும் உயர்தரத்தை உறுதி செய்த பிறகே வாடிக்கையாளர்களுக்கு வழங்கப்படுகிறது.',
  },
  {
    icon: <Heart size={24} />,
    title: "Nature's Sweetest Gift",
    desc: <>We believe honey should remain as close to nature as possible — <H>pure</H>, authentic, <H>minimally processed</H>, and responsibly harvested.</>,
    taTitle: 'இயற்கையின் இனிய பரிசு',
    taDesc: 'இயற்கை வழங்கிய வடிவத்திற்கு மிக அருகில் இருக்கும், தூய்மையான, இயற்கையான தேனை வழங்குவதே எங்கள் நோக்கம்.',
  },
]

const TEAM = [
  { name: 'Sivakumar', role: 'Proprietor', initial: 'S' },
]

export default function AboutPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] flex items-end overflow-hidden">
        <Image src={HERO_MOBILE}  alt="Wild honey" fill priority className="object-cover md:hidden" />
        <Image src={HERO_DESKTOP} alt="Beekeeping" fill priority className="object-cover hidden md:block" />
        <div className="absolute inset-0 bg-gradient-to-t from-onyx/80 via-onyx/30 to-transparent" />
        <div className="relative z-10 p-8 sm:p-16 max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="font-heading font-bold text-5xl sm:text-6xl text-white mb-4 leading-tight">
              Our Story
            </h1>
            <p className="text-white/70 text-xl">Pure honey, honest craft, real people</p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="font-heading font-bold text-4xl text-onyx mb-6">
                Born in the Forest,<br />
                <span className="text-gradient-honey">Delivered to Your Door</span>
              </h2>
              <div className="text-onyx/60 leading-relaxed space-y-4">
                <p>
                  GOLDEN HONEY was founded by <span className="text-onyx font-semibold">Sivakumar</span>, a passionate advocate for pure, natural food who believed that real honey was disappearing from Indian homes — replaced by processed, adulterated imitations.
                </p>
                <p>
                  His journey began in the hills of <span className="text-onyx font-semibold">Kodaikanal</span>, where he connected directly with indigenous tribal communities who have harvested wild honey using traditional methods for generations. No hives, no chemicals — just bees, forests, and ancestral knowledge.
                </p>
                <p>
                  Sivakumar built Golden Honey on one simple promise: bring that untouched, forest-fresh honey straight to your door. No middlemen, no heating, no shortcuts — exactly as nature made it.
                </p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="relative aspect-[4/3] rounded-card overflow-hidden shadow-xl">
                <Image src={FOREST} alt="Forest beekeeping" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values — Why Choose Golden Honey */}
      <section className="py-20 bg-parchment">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="font-heading font-bold text-4xl text-onyx mb-2">Why Choose Golden Honey?</h2>
            <p lang="ta" className="text-onyx/40 text-lg mt-1">ஏன் Golden Honey?</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v, i) => (
              <motion.div key={v.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className="flex flex-col p-6 bg-white rounded-xl border border-black/5 shadow-sm"
              >
                <span className="inline-flex w-11 h-11 rounded-full bg-honey/15 items-center justify-center text-honey mb-4 shrink-0">{v.icon}</span>
                <h3 className="font-heading font-semibold text-base text-onyx mb-2">{v.title}</h3>
                <p className="text-onyx/55 text-sm leading-relaxed">{v.desc}</p>
                <div className="mt-4 pt-4 border-t border-black/5">
                  <h4 lang="ta" className="font-semibold text-sm text-onyx/75 mb-1.5">{v.taTitle}</h4>
                  <p lang="ta" className="text-onyx/45 text-xs leading-relaxed">{v.taDesc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="font-heading font-bold text-4xl text-onyx mb-3">The Team</h2>
          </motion.div>
          <div className="flex justify-center">
            {TEAM.map((m, i) => (
              <motion.div key={m.name} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="text-center bg-white rounded-xl p-7 border border-black/5 shadow-sm"
              >
                <div className="w-16 h-16 rounded-full bg-honey/20 flex items-center justify-center text-xl font-bold text-honey mx-auto mb-4">
                  {m.initial}
                </div>
                <p className="font-heading font-semibold text-onyx">{m.name}</p>
                <p className="text-xs text-onyx/40 mt-1">{m.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-onyx text-center">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <h2 className="font-heading font-bold text-3xl text-white mb-4">Taste the Difference</h2>
          <p className="text-white/50 mb-8">Join thousands of families who've made the switch to real honey.</p>
          <Link href="/shop">
            <Button size="lg">Shop Now <ArrowRight size={18} /></Button>
          </Link>
        </motion.div>
      </section>
    </main>
  )
}
