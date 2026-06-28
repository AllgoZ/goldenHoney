'use client'
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  fullWidth?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const base = 'inline-flex items-center justify-center font-semibold rounded-xl transition-[background-color,box-shadow,border-color,color,transform,opacity] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-honey focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.97]'

    const variants = {
      primary:   'bg-honey text-onyx hover:bg-honey-dark shadow-sm hover:shadow-md',
      secondary: 'bg-onyx text-white hover:bg-onyx/80',
      ghost:     'bg-transparent text-onyx hover:bg-honey/10',
      outline:   'border-2 border-onyx text-onyx bg-transparent hover:bg-onyx hover:text-white',
      danger:    'bg-red-500 text-white hover:bg-red-600',
    }

    const sizes = {
      sm: 'h-8  px-3 text-xs gap-1.5',
      md: 'h-10 px-5 text-sm gap-2',
      lg: 'h-12 px-7 text-base gap-2.5',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(base, variants[variant], sizes[size], fullWidth && 'w-full', className)}
        {...props}
      >
        {loading && (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" aria-hidden="true" />
        )}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'
export default Button
