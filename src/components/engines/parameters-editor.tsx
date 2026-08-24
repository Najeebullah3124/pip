import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { ParamDef } from '@/data/engine-data'

interface ParametersEditorProps {
  parameters: ParamDef[]
  onChange: (key: string, value: number | string) => void
}

export function ParametersEditor({ parameters, onChange }: ParametersEditorProps) {
  return (
    <div className="flex flex-col gap-6">
      {parameters.map((param) => (
        <div key={param.key} className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label>{param.label}</Label>
            {param.type === 'slider' && (
              <span className="text-xs font-semibold tabular-nums text-foreground-muted">
                {param.value}
                {param.unit ?? ''}
              </span>
            )}
          </div>
          {param.type === 'slider' ? (
            <Slider
              value={[Number(param.value)]}
              min={param.min}
              max={param.max}
              step={param.step}
              onValueChange={([v]) => onChange(param.key, v)}
            />
          ) : (
            <Select value={String(param.value)} onValueChange={(v) => onChange(param.key, v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {param.options?.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <p className="text-xs text-foreground-subtle">{param.description}</p>
        </div>
      ))}
    </div>
  )
}
