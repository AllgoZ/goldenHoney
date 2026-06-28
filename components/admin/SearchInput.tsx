'use client'
import { Search, X } from 'lucide-react'

interface SearchInputProps {
  value:       string
  onChange:    (v: string) => void
  placeholder?: string
  className?:  string
}

export default function SearchInput({ value, onChange, placeholder = 'Search…', className }: SearchInputProps) {
  return (
    <div className={`relative ${className ?? ''}`}>
      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-onyx/30 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-9 pl-9 pr-8 text-sm bg-white border border-onyx/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-honey/50 focus:border-honey text-onyx placeholder:text-onyx/30"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-onyx/30 hover:text-onyx/60 transition-colors"
        >
          <X size={13} />
        </button>
      )}
    </div>
  )
}
