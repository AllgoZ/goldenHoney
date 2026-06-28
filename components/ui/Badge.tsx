import { cn } from '@/lib/utils'

interface BadgeProps {
  label: string
  variant?: 'bestseller' | 'limited' | 'new' | 'sale' | 'default'
  className?: string
}

const variants = {
  bestseller: 'bg-honey text-onyx',
  limited:    'bg-red-sale text-white',
  new:        'bg-sage text-white',
  sale:       'bg-honey-dark text-white',
  default:    'bg-onyx/10 text-onyx',
}

export default function Badge({ label, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-chip',
        variants[variant],
        className
      )}
    >
      {label}
    </span>
  )
}
