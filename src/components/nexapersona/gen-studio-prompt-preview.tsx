import { Terminal } from 'lucide-react'

export function PromptPreview({ text }: { text: string }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-foreground-subtle">
        <Terminal className="size-3.5" />
        Prompt preview
      </p>
      <pre className="max-h-32 overflow-y-auto whitespace-pre-wrap rounded-xl border border-border bg-surface-2 p-3 font-mono text-xs leading-relaxed text-foreground-muted">
        {text}
      </pre>
    </div>
  )
}
