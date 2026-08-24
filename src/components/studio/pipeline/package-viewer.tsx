import { Cpu, Zap, Fingerprint, Blocks, FileText, Ban, Settings2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { CompiledPackage } from '@/lib/prompt-compile'

function Section({ icon: Icon, label, children }: { icon: React.ElementType; label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-surface-2 p-3.5">
      <p className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-subtle">
        <Icon className="size-3" />
        {label}
      </p>
      {children}
    </div>
  )
}

export function PackageViewer({ pkg }: { pkg: CompiledPackage }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="accent" className="flex items-center gap-1">
          <Cpu className="size-3" />
          {pkg.engine}
        </Badge>
        <Badge variant="outline" className="flex items-center gap-1">
          <Zap className="size-3" />
          {pkg.tokens} tokens
        </Badge>
        {pkg.characterName && (
          <Badge variant="outline" className="flex items-center gap-1">
            <Fingerprint className="size-3" />
            {pkg.characterName}
          </Badge>
        )}
      </div>

      <Section icon={Settings2} label="System">
        <p className="text-xs leading-relaxed text-foreground-muted">{pkg.system}</p>
      </Section>

      <Section icon={FileText} label="Prompt">
        <p className="text-xs leading-relaxed text-foreground">{pkg.prompt}</p>
      </Section>

      <Section icon={Ban} label="Negative prompt">
        <p className="text-xs leading-relaxed text-foreground-muted">{pkg.negative}</p>
      </Section>

      <Section icon={Blocks} label={`Components (${pkg.componentNames.length})`}>
        {pkg.componentNames.length === 0 ? (
          <p className="text-xs text-foreground-subtle">None attached</p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {pkg.componentNames.map((name) => (
              <Badge key={name} variant="outline" className="text-[10px]">
                {name}
              </Badge>
            ))}
          </div>
        )}
      </Section>
    </div>
  )
}
