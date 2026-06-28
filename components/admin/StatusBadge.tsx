import { cn } from '@/lib/utils'

type Status =
  | 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  | 'active' | 'draft' | 'archived' | 'inactive'
  | 'approved' | 'rejected'
  | 'customer' | 'admin' | 'super_admin' | 'manager' | 'staff'
  | 'suspended' | 'deleted'
  | 'percentage' | 'flat'
  | 'failed'
  | string

const MAP: Record<string, string> = {
  active:      'bg-green-50  text-green-700  border-green-200',
  approved:    'bg-green-50  text-green-700  border-green-200',
  delivered:   'bg-green-50  text-green-700  border-green-200',
  paid:        'bg-blue-50   text-blue-700   border-blue-200',
  processing:  'bg-purple-50 text-purple-700 border-purple-200',
  shipped:     'bg-orange-50 text-orange-700 border-orange-200',
  pending:     'bg-amber-50  text-amber-700  border-amber-200',
  draft:       'bg-amber-50  text-amber-700  border-amber-200',
  cancelled:   'bg-red-50    text-red-600    border-red-200',
  rejected:    'bg-red-50    text-red-600    border-red-200',
  suspended:   'bg-red-50    text-red-600    border-red-200',
  failed:      'bg-red-50    text-red-600    border-red-200',
  refunded:    'bg-slate-50  text-slate-600  border-slate-200',
  archived:    'bg-slate-50  text-slate-600  border-slate-200',
  inactive:    'bg-slate-50  text-slate-600  border-slate-200',
  deleted:     'bg-slate-50  text-slate-600  border-slate-200',
}

interface StatusBadgeProps {
  status: Status
  className?: string
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const styles = MAP[status] ?? 'bg-slate-50 text-slate-600 border-slate-200'
  const label = status.replace(/_/g, ' ')
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-chip text-[11px] font-semibold border capitalize', styles, className)}>
      {label}
    </span>
  )
}
