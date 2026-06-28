'use client'
import { Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface QuantitySelectorProps {
  value: number
  min?: number
  max?: number
  onChange: (value: number) => void
  size?: 'sm' | 'md'
  className?: string
}

export default function QuantitySelector({
  value,
  min = 1,
  max = 20,
  onChange,
  size = 'md',
  className,
}: QuantitySelectorProps) {
  const btnClass = cn(
    'flex items-center justify-center rounded-lg border border-onyx/15 bg-white hover:bg-honey/10 transition-colors',
    size === 'sm' ? 'w-7 h-7' : 'w-9 h-9'
  )

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className={cn(btnClass, 'disabled:opacity-30 disabled:cursor-not-allowed')}
        aria-label="Decrease quantity"
      >
        <Minus size={size === 'sm' ? 12 : 14} />
      </button>
      <span className={cn('font-semibold text-onyx min-w-[1.5rem] text-center', size === 'sm' ? 'text-sm' : 'text-base')}>
        {value}
      </span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className={cn(btnClass, 'disabled:opacity-30 disabled:cursor-not-allowed')}
        aria-label="Increase quantity"
      >
        <Plus size={size === 'sm' ? 12 : 14} />
      </button>
    </div>
  )
}
