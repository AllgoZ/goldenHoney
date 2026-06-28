'use client'
import { useRef, useState } from 'react'
import Image from 'next/image'
import { Upload, X, Loader2 } from 'lucide-react'
import { uploadImage, type StorageFolder } from '@/lib/services/cloudinary.service'

interface ImageUploadProps {
  folder:    StorageFolder
  value?:    string
  onChange:  (url: string) => void
  onRemove?: () => void
  className?: string
}

export default function ImageUpload({ folder, value, onChange, onRemove, className }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { setError('Please select an image file'); return }
    if (file.size > 5 * 1024 * 1024) { setError('File must be under 5 MB'); return }

    setError('')
    setUploading(true)
    try {
      const url = await uploadImage(file, {
        folder,
        onProgress: setProgress,
      })
      onChange(url)
    } catch {
      setError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
      setProgress(0)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  if (value) {
    return (
      <div className={`relative w-28 h-28 rounded-xl overflow-hidden border border-black/10 group ${className ?? ''}`}>
        <Image src={value} alt="Uploaded" fill className="object-cover" />
        {onRemove && (
          <button
            onClick={onRemove}
            type="button"
            className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={12} />
          </button>
        )}
      </div>
    )
  }

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="w-28 h-28 rounded-xl border-2 border-dashed border-onyx/15 hover:border-honey/60 transition-[border-color] duration-150 flex flex-col items-center justify-center gap-2 text-onyx/40 hover:text-onyx/60 disabled:opacity-50"
      >
        {uploading ? (
          <>
            <Loader2 size={18} className="animate-spin text-honey" />
            <span className="text-xs">{progress}%</span>
          </>
        ) : (
          <>
            <Upload size={18} />
            <span className="text-xs">Upload</span>
          </>
        )}
      </button>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}
