import type { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  label:   string
  value:   string | number
  icon:    LucideIcon
  color?:  'honey' | 'green' | 'blue' | 'purple' | 'red'
  sub?:    string
}

const colorMap = {
  honey:  { bg: 'bg-honey/10',   icon: 'text-honey',     border: 'border-honey/20' },
  green:  { bg: 'bg-green-50',   icon: 'text-green-600', border: 'border-green-200' },
  blue:   { bg: 'bg-blue-50',    icon: 'text-blue-600',  border: 'border-blue-200' },
  purple: { bg: 'bg-purple-50',  icon: 'text-purple-600',border: 'border-purple-200' },
  red:    { bg: 'bg-red-50',     icon: 'text-red-500',   border: 'border-red-200' },
}

export default function StatsCard({ label, value, icon: Icon, color = 'honey', sub }: StatsCardProps) {
  const c = colorMap[color]
  return (
    <div className={`bg-white rounded-card border ${c.border} p-5 flex items-start gap-4`}>
      <div className={`w-11 h-11 rounded-xl ${c.bg} flex items-center justify-center shrink-0`}>
        <Icon size={20} className={c.icon} />
      </div>
      <div>
        <p className="text-xs text-onyx/40 font-medium uppercase tracking-wider mb-0.5">{label}</p>
        <p className="text-2xl font-heading font-bold text-onyx">{value}</p>
        {sub && <p className="text-xs text-onyx/40 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}
