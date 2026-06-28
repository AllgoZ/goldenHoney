import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon?:    LucideIcon
  title:    string
  message?: string
  action?:  React.ReactNode
}

export default function EmptyState({ icon: Icon, title, message, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-onyx/5 flex items-center justify-center mb-4">
          <Icon size={24} className="text-onyx/30" />
        </div>
      )}
      <p className="font-heading font-semibold text-onyx/60 text-base mb-1">{title}</p>
      {message && <p className="text-sm text-onyx/40 max-w-xs mb-4">{message}</p>}
      {action}
    </div>
  )
}
