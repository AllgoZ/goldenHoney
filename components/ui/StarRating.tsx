import { cn } from '@/lib/utils'

interface StarRatingProps {
  rating: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  showCount?: boolean
  count?: number
  className?: string
}

export default function StarRating({
  rating,
  max = 5,
  size = 'md',
  showCount = false,
  count,
  className,
}: StarRatingProps) {
  const sizes = { sm: 'text-xs', md: 'text-sm', lg: 'text-base' }

  return (
    <span className={cn('flex items-center gap-1', sizes[size], className)}>
      <span className="flex" aria-label={`Rating: ${rating} out of ${max}`}>
        {Array.from({ length: max }).map((_, i) => {
          const fill = Math.min(Math.max(rating - i, 0), 1)
          return (
            <span key={i} className="relative inline-block">
              <span className="text-gray-200">★</span>
              <span
                className="absolute inset-0 overflow-hidden text-honey"
                style={{ width: `${fill * 100}%` }}
              >
                ★
              </span>
            </span>
          )
        })}
      </span>
      <span className="font-semibold text-onyx">{rating.toFixed(1)}</span>
      {showCount && count !== undefined && (
        <span className="text-onyx/50">({count.toLocaleString('en-IN')})</span>
      )}
    </span>
  )
}
