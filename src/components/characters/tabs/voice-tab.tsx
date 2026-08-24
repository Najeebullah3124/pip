import * as React from 'react'
import { Play, Pause, Mic } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DnaField, DnaSection } from '@/components/characters/dna-field'
import type { Voice } from '@/data/character-data'

const providers = ['ElevenLabs', 'PlayHT', 'Azure Neural', 'OpenAI Voice']
const accents = ['Neutral American', 'British RP', 'Australian', 'Neutral Canadian', 'Irish']

interface VoiceTabProps {
  data: Voice
  mode: 'view' | 'edit'
  onChange?: (patch: Partial<Voice>) => void
}

function SamplePlayer({ sampleLine }: { sampleLine: string }) {
  const [playing, setPlaying] = React.useState(false)

  React.useEffect(() => {
    if (!playing) return
    const t = setTimeout(() => setPlaying(false), 2400)
    return () => clearTimeout(t)
  }, [playing])

  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-surface-2 p-3.5">
      <Button variant="primary" size="icon" className="shrink-0 rounded-full" onClick={() => setPlaying((p) => !p)}>
        {playing ? <Pause /> : <Play />}
      </Button>
      <div className="flex flex-1 items-center gap-0.5">
        {Array.from({ length: 32 }).map((_, i) => (
          <span
            key={i}
            className="w-1 rounded-full bg-accent-200 transition-all duration-300"
            style={{
              height: playing ? `${8 + ((i * 37) % 20)}px` : '4px',
              backgroundColor: playing ? 'var(--accent)' : undefined,
              transitionDelay: `${i * 15}ms`,
            }}
          />
        ))}
      </div>
      <p className="max-w-[40%] shrink-0 truncate text-xs italic text-foreground-subtle">"{sampleLine}"</p>
    </div>
  )
}

export function VoiceTab({ data, mode, onChange }: VoiceTabProps) {
  if (mode === 'view') {
    return (
      <DnaSection title="Voice" description="The vocal identity used across audio and video generations.">
        <Card className="grid grid-cols-1 gap-x-6 gap-y-5 p-6 sm:grid-cols-2 lg:grid-cols-4">
          <DnaField label="Provider" value={data.provider} />
          <DnaField label="Accent" value={data.accent} />
          <DnaField label="Pitch" value={`${data.pitch}%`} />
          <DnaField label="Speed" value={`${data.speed}%`} />
        </Card>
        <Card className="p-5">
          <div className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-foreground-subtle">
            <Mic className="size-3.5" />
            Sample line
          </div>
          <SamplePlayer sampleLine={data.sampleLine} />
        </Card>
      </DnaSection>
    )
  }

  return (
    <DnaSection title="Voice" description="Configure the vocal identity used across audio and video generations.">
      <Card className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="voice-provider">Provider</Label>
          <Select value={data.provider} onValueChange={(v) => onChange?.({ provider: v })}>
            <SelectTrigger id="voice-provider">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {providers.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="voice-accent">Accent</Label>
          <Select value={data.accent} onValueChange={(v) => onChange?.({ accent: v })}>
            <SelectTrigger id="voice-accent">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {accents.map((a) => (
                <SelectItem key={a} value={a}>
                  {a}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card className="flex flex-col gap-6 p-6">
        {(['pitch', 'speed', 'stability'] as const).map((key) => (
          <div key={key} className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <Label className="capitalize">{key}</Label>
              <span className="text-xs font-semibold tabular-nums text-foreground-muted">{data[key]}%</span>
            </div>
            <Slider value={[data[key]]} max={100} step={1} onValueChange={([v]) => onChange?.({ [key]: v } as Partial<Voice>)} />
          </div>
        ))}
      </Card>

      <Card className="flex flex-col gap-3 p-6">
        <Label htmlFor="voice-sample">Sample line</Label>
        <Input id="voice-sample" value={data.sampleLine} onChange={(e) => onChange?.({ sampleLine: e.target.value })} />
        <SamplePlayer sampleLine={data.sampleLine} />
      </Card>
    </DnaSection>
  )
}
