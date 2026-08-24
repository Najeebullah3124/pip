import * as React from 'react'
import { cn } from '@/lib/utils'

interface HighlightedEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  minHeight?: number
  onCursorMove?: (pos: number) => void
  onDropText?: (text: string, pos: number) => void
}

const TOKEN_RE = /(\{\{\w+\}\}|\[\[[^\]]+\]\])/g

function renderHighlighted(text: string) {
  const parts: React.ReactNode[] = []
  let lastIndex = 0
  let key = 0
  for (const match of text.matchAll(TOKEN_RE)) {
    const index = match.index ?? 0
    if (index > lastIndex) parts.push(text.slice(lastIndex, index))
    const token = match[0]
    if (token.startsWith('{{')) {
      parts.push(
        <span key={key++} className="rounded bg-accent-soft text-accent-700">
          {token}
        </span>
      )
    } else {
      parts.push(
        <span key={key++} className="rounded bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">
          {token}
        </span>
      )
    }
    lastIndex = index + token.length
  }
  parts.push(text.slice(lastIndex) + '\n')
  return parts
}

export function HighlightedEditor({ value, onChange, placeholder, className, minHeight = 200, onCursorMove, onDropText }: HighlightedEditorProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const backdropRef = React.useRef<HTMLDivElement>(null)
  const [dragOver, setDragOver] = React.useState(false)

  function syncScroll() {
    if (textareaRef.current && backdropRef.current) {
      backdropRef.current.scrollTop = textareaRef.current.scrollTop
      backdropRef.current.scrollLeft = textareaRef.current.scrollLeft
    }
  }

  function reportCursor() {
    if (textareaRef.current) onCursorMove?.(textareaRef.current.selectionStart)
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border border-input bg-surface-2 shadow-elevation-1 transition-colors',
        dragOver && 'border-accent ring-2 ring-ring/30',
        className
      )}
      style={{ minHeight }}
      onDragOver={(e) => {
        e.preventDefault()
        setDragOver(true)
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragOver(false)
        const text = e.dataTransfer.getData('text/plain')
        if (text) onDropText?.(text, textareaRef.current?.selectionStart ?? value.length)
      }}
    >
      <div
        ref={backdropRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-auto whitespace-pre-wrap break-words p-3.5 font-mono text-[13px] leading-relaxed text-foreground"
      >
        {value ? renderHighlighted(value) : <span className="text-foreground-subtle">{placeholder}</span>}
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onScroll={syncScroll}
        onSelect={reportCursor}
        onKeyUp={reportCursor}
        onClick={reportCursor}
        onFocus={reportCursor}
        spellCheck={false}
        className="relative h-full w-full resize-none whitespace-pre-wrap break-words bg-transparent p-3.5 font-mono text-[13px] leading-relaxed text-transparent caret-foreground outline-none placeholder:text-transparent"
        style={{ minHeight }}
      />
    </div>
  )
}
