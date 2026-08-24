import * as React from 'react'
import { UploadCloud, X, ImagePlus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageUploaderProps {
  images: string[]
  onChange: (images: string[]) => void
  label?: string
  hint?: string
  maxImages?: number
  variant?: 'single' | 'grid'
}

function filesToDataUrls(files: FileList | File[]): Promise<string[]> {
  const list = Array.from(files).filter((f) => f.type.startsWith('image/'))
  return Promise.all(
    list.map(
      (file) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(file)
        })
    )
  )
}

export function ImageUploader({ images, onChange, label, hint, maxImages, variant = 'grid' }: ImageUploaderProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = React.useState(false)
  const remaining = maxImages ? maxImages - images.length : Infinity

  async function addFiles(files: FileList | File[]) {
    const urls = await filesToDataUrls(files)
    const next = variant === 'single' ? urls.slice(0, 1) : [...images, ...urls].slice(0, maxImages ?? undefined)
    onChange(next)
  }

  function removeAt(i: number) {
    onChange(images.filter((_, idx) => idx !== i))
  }

  const showDropzone = variant === 'single' ? images.length === 0 : remaining > 0

  return (
    <div className="flex flex-col gap-3">
      {label && (
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-foreground-subtle">{label}</p>
          {maxImages && (
            <p className="text-xs text-foreground-subtle">
              {images.length}/{maxImages}
            </p>
          )}
        </div>
      )}

      {variant === 'single' && images[0] && (
        <div className="group relative size-28 overflow-hidden rounded-2xl border border-border shadow-elevation-1">
          <img src={images[0]} alt="Uploaded preview" className="size-full object-cover" />
          <button
            onClick={() => removeAt(0)}
            className="absolute right-1.5 top-1.5 flex size-6 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
            aria-label="Remove image"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}

      {variant === 'grid' && images.length > 0 && (
        <div className="grid grid-cols-4 gap-2.5 sm:grid-cols-6">
          {images.map((src, i) => (
            <div key={i} className="group relative aspect-square overflow-hidden rounded-xl border border-border">
              <img src={src} alt={`Reference ${i + 1}`} className="size-full object-cover" />
              <button
                onClick={() => removeAt(i)}
                className="absolute right-1 top-1 flex size-5 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
                aria-label="Remove image"
              >
                <X className="size-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {showDropzone && (
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragging(false)
            if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files)
          }}
          onClick={() => inputRef.current?.click()}
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-6 text-center transition-colors',
            variant === 'single' ? 'size-28' : 'w-full',
            dragging ? 'border-accent bg-accent-soft' : 'border-border-strong bg-surface-2 hover:border-accent hover:bg-accent-soft/40'
          )}
        >
          {variant === 'single' ? (
            <ImagePlus className="size-5 text-foreground-subtle" />
          ) : (
            <>
              <UploadCloud className="size-5 text-foreground-subtle" />
              <p className="text-xs font-medium text-foreground-muted">Drag images here or click to upload</p>
              {hint && <p className="text-[11px] text-foreground-subtle">{hint}</p>}
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple={variant === 'grid'}
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.length) addFiles(e.target.files)
              e.target.value = ''
            }}
          />
        </div>
      )}
    </div>
  )
}
