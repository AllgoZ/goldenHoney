import React from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'

interface PageHeaderProps {
  title:        string
  description?: string
  actionLabel?: string
  actionHref?:  string
  onAction?:    () => void
  children?:    React.ReactNode
}

export default function PageHeader({ title, description, actionLabel, actionHref, onAction, children }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="font-heading font-bold text-xl text-onyx">{title}</h2>
        {description && <p className="text-sm text-onyx/50 mt-0.5">{description}</p>}
      </div>
      {children ?? (actionLabel && (
        actionHref ? (
          <Link
            href={actionHref}
            className="inline-flex items-center gap-2 h-9 px-4 bg-honey text-onyx text-sm font-semibold rounded-xl hover:bg-honey-dark transition-[background-color] duration-150"
          >
            <Plus size={15} /> {actionLabel}
          </Link>
        ) : (
          <button
            onClick={onAction}
            className="inline-flex items-center gap-2 h-9 px-4 bg-honey text-onyx text-sm font-semibold rounded-xl hover:bg-honey-dark transition-[background-color] duration-150"
          >
            <Plus size={15} /> {actionLabel}
          </button>
        )
      ))}
    </div>
  )
}
