import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Sparkles, Save, Eye, Check, History } from 'lucide-react'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { StepIndicator } from '@/components/onboarding/step-indicator'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { ImageUploader } from '@/components/characters/image-uploader'
import { AutoSaveIndicator, type SaveState } from '@/components/characters/auto-save-indicator'
import { CharacterDnaCard } from '@/components/characters/character-dna-card'
import { CharacterPreviewDialog } from '@/components/characters/character-preview-dialog'
import { AppearanceTab } from '@/components/characters/tabs/appearance-tab'
import { PersonalityTab } from '@/components/characters/tabs/personality-tab'
import { VoiceTab } from '@/components/characters/tabs/voice-tab'
import { WardrobeTab } from '@/components/characters/tabs/wardrobe-tab'
import { CameraTab } from '@/components/characters/tabs/camera-tab'
import { LightingTab } from '@/components/characters/tabs/lighting-tab'
import { EnvironmentTab } from '@/components/characters/tabs/environment-tab'
import { LoraTab } from '@/components/characters/tabs/lora-tab'
import { addCharacter, buildDefaultDna, updateCharacter, type Character } from '@/data/character-data'
import { useToast } from '@/hooks/use-toast'

const gradientPairs: [string, string][] = [
  ['#a78bfa', '#7c3aed'], ['#f0abfc', '#c026d3'], ['#93c5fd', '#2563eb'], ['#5eead4', '#0891b2'],
  ['#fda4af', '#e11d48'], ['#fde68a', '#d97706'], ['#86efac', '#16a34a'], ['#c4b5fd', '#6d28d9'],
]
const appList = ['Prompt Studio', 'NexaPersona', 'Animovia', 'Private Platform']

const steps = ['Basics', 'Appearance', 'Personality', 'Voice', 'Wardrobe', 'Camera', 'Lighting', 'Environment', 'LoRA', 'Review']
const AUTOSAVE_KEY = 'pip.character.wizard.autosave'

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

function newDraftCharacter(): Character {
  const [gradientFrom, gradientTo] = gradientPairs[0]
  return {
    id: '',
    name: '',
    tagline: '',
    status: 'Draft',
    gradientFrom,
    gradientTo,
    applications: ['Prompt Studio'],
    generationCount: 0,
    lastUsed: 'Never',
    createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    owner: 'Emerson Sterling',
    tags: ['New'],
    ...buildDefaultDna(),
  }
}

export default function CharacterCreatePage() {
  const navigate = useNavigate()
  const { toast } = useToast()

  const [step, setStep] = React.useState(0)
  const [character, setCharacter] = React.useState<Character>(newDraftCharacter)
  const [gradientIndex, setGradientIndex] = React.useState(0)
  const [nameError, setNameError] = React.useState<string>()
  const [previewOpen, setPreviewOpen] = React.useState(false)
  const [creating, setCreating] = React.useState(false)
  const [savingDraft, setSavingDraft] = React.useState(false)
  const [draftId, setDraftId] = React.useState<string | null>(null)
  const [saveState, setSaveState] = React.useState<SaveState>('idle')
  const [savedAt, setSavedAt] = React.useState<number | null>(null)
  const [restoreAvailable, setRestoreAvailable] = React.useState(false)

  const skipNextAutosave = React.useRef(true)

  React.useEffect(() => {
    if (localStorage.getItem(AUTOSAVE_KEY)) setRestoreAvailable(true)
  }, [])

  // Debounced autosave to localStorage whenever wizard state changes.
  React.useEffect(() => {
    if (skipNextAutosave.current) {
      skipNextAutosave.current = false
      return
    }
    if (restoreAvailable) return
    setSaveState('saving')
    const t = setTimeout(() => {
      localStorage.setItem(AUTOSAVE_KEY, JSON.stringify({ character, step, gradientIndex, draftId }))
      setSaveState('saved')
      setSavedAt(Date.now())
    }, 900)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [character, step, gradientIndex])

  // Keep LoRA training image count in sync with uploaded appearance references.
  React.useEffect(() => {
    const count = character.appearance.referenceImages?.length ?? 0
    if (count !== character.lora.trainingImages) {
      setCharacter((prev) => ({ ...prev, lora: { ...prev.lora, trainingImages: count } }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [character.appearance.referenceImages])

  function restoreDraft() {
    const raw = localStorage.getItem(AUTOSAVE_KEY)
    if (raw) {
      try {
        const parsed = JSON.parse(raw)
        setCharacter(parsed.character)
        setStep(parsed.step ?? 0)
        setGradientIndex(parsed.gradientIndex ?? 0)
        setDraftId(parsed.draftId ?? null)
        toast({ title: 'Draft restored', description: 'Continuing where you left off.' })
      } catch {
        /* ignore malformed autosave */
      }
    }
    setRestoreAvailable(false)
  }

  function discardDraft() {
    localStorage.removeItem(AUTOSAVE_KEY)
    setRestoreAvailable(false)
  }

  function onFieldChange<K extends keyof Character>(section: K, patch: Partial<Character[K]>) {
    setCharacter((prev) => {
      const current = prev[section]
      if (typeof current !== 'object' || current === null) return prev
      return { ...prev, [section]: { ...current, ...patch } }
    })
  }

  function next() {
    if (step === 0 && !character.name.trim()) {
      setNameError('Character name is required')
      return
    }
    setNameError(undefined)
    setStep((s) => Math.min(steps.length - 1, s + 1))
  }

  async function saveDraft() {
    if (!character.name.trim()) {
      setNameError('Add a name before saving a draft')
      setStep(0)
      return
    }
    setSavingDraft(true)
    await delay(600)
    const id = draftId ?? `char_${Date.now()}`
    const record: Character = { ...character, id, status: 'Draft' }
    if (draftId) updateCharacter(draftId, record)
    else {
      addCharacter(record)
      setDraftId(id)
    }
    localStorage.removeItem(AUTOSAVE_KEY)
    setSavingDraft(false)
    toast({ title: 'Draft saved', description: `${character.name} was added to your gallery as a draft.`, variant: 'success' })
    navigate('/characters')
  }

  async function create() {
    if (!character.name.trim()) {
      setNameError('Character name is required')
      setStep(0)
      return
    }
    setCreating(true)
    await delay(1000)
    const id = draftId ?? `char_${Date.now()}`
    const record: Character = { ...character, id }
    if (draftId) updateCharacter(draftId, record)
    else addCharacter(record)
    localStorage.removeItem(AUTOSAVE_KEY)
    setCreating(false)
    toast({ title: 'Character created', description: `${character.name}'s DNA is ready to use.`, variant: 'success' })
    navigate(`/characters/${id}`)
  }

  const previewCharacter: Character = {
    ...character,
    gradientFrom: gradientPairs[gradientIndex][0],
    gradientTo: gradientPairs[gradientIndex][1],
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Breadcrumbs items={[{ label: 'Characters', href: '/characters' }, { label: 'Create' }]} />
        <AutoSaveIndicator state={saveState} savedAt={savedAt} />
      </div>

      {restoreAvailable && (
        <div className="flex items-center gap-3 rounded-2xl border border-accent-200 bg-accent-soft px-4 py-3 animate-fade-in-up">
          <History className="size-4.5 shrink-0 text-accent" />
          <p className="flex-1 text-sm text-accent-700">You have unsaved progress from a previous session.</p>
          <Button variant="secondary" size="sm" onClick={discardDraft}>
            Discard
          </Button>
          <Button size="sm" onClick={restoreDraft}>
            Restore progress
          </Button>
        </div>
      )}

      <div className="mx-auto w-full max-w-3xl">
        <Card className="p-6 sm:p-8">
          <StepIndicator steps={steps} current={step} onStepClick={setStep} />

          <div className="mt-8 min-h-[360px]">
            {step === 0 && (
              <div className="flex flex-col gap-5 animate-fade-in-up">
                <div>
                  <h2 className="text-lg font-bold text-foreground">Let's start with the basics</h2>
                  <p className="text-sm text-foreground-muted">Every character starts as a draft — refine every detail across the steps ahead.</p>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <ImageUploader
                    variant="single"
                    images={character.portraitImage ? [character.portraitImage] : []}
                    onChange={(imgs) => setCharacter((prev) => ({ ...prev, portraitImage: imgs[0] }))}
                    label="Portrait"
                  />
                  <div className="flex-1">
                    <p className="mb-2 text-xs font-medium text-foreground-subtle">Or choose an identity color</p>
                    <div className="flex flex-wrap items-center gap-3">
                      {gradientPairs.map(([from, to], i) => (
                        <button
                          key={i}
                          onClick={() => setGradientIndex(i)}
                          className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-2xl transition-transform hover:scale-105"
                          style={{
                            background: `linear-gradient(135deg, ${from}, ${to})`,
                            outline: gradientIndex === i ? '2px solid var(--ring)' : 'none',
                            outlineOffset: '2px',
                          }}
                          aria-label={`Choose color ${i + 1}`}
                        >
                          {gradientIndex === i && <Check className="size-3.5 text-white" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="new-name">Character name</Label>
                  <Input
                    id="new-name"
                    placeholder="e.g. Nova"
                    value={character.name}
                    invalid={!!nameError}
                    onChange={(e) => {
                      setCharacter((prev) => ({ ...prev, name: e.target.value }))
                      setNameError(undefined)
                    }}
                  />
                  {nameError && <p className="text-xs font-medium text-destructive">{nameError}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="new-tagline">Tagline / role</Label>
                  <Input
                    id="new-tagline"
                    placeholder="e.g. Support Guide"
                    value={character.tagline}
                    onChange={(e) => setCharacter((prev) => ({ ...prev, tagline: e.target.value }))}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Applications</Label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {appList.map((app) => (
                      <label
                        key={app}
                        className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-border px-3 py-2.5 text-sm transition-colors hover:bg-muted"
                      >
                        <Checkbox
                          checked={character.applications.includes(app)}
                          onCheckedChange={() =>
                            setCharacter((prev) => ({
                              ...prev,
                              applications: prev.applications.includes(app)
                                ? prev.applications.filter((a) => a !== app)
                                : [...prev.applications, app],
                            }))
                          }
                        />
                        {app}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="flex flex-col gap-6 animate-fade-in-up">
                <AppearanceTab data={character.appearance} mode="edit" onChange={(p) => onFieldChange('appearance', p)} />
                <Card className="p-6">
                  <ImageUploader
                    variant="grid"
                    maxImages={6}
                    label="Reference images"
                    hint="Used to train this character's LoRA identity model"
                    images={character.appearance.referenceImages ?? []}
                    onChange={(imgs) => onFieldChange('appearance', { referenceImages: imgs })}
                  />
                </Card>
              </div>
            )}

            {step === 2 && (
              <div className="animate-fade-in-up">
                <PersonalityTab data={character.personality} mode="edit" onChange={(p) => onFieldChange('personality', p)} />
              </div>
            )}

            {step === 3 && (
              <div className="animate-fade-in-up">
                <VoiceTab data={character.voice} mode="edit" onChange={(p) => onFieldChange('voice', p)} />
              </div>
            )}

            {step === 4 && (
              <div className="animate-fade-in-up">
                <WardrobeTab data={character.wardrobe} mode="edit" onChange={(p) => onFieldChange('wardrobe', p)} />
              </div>
            )}

            {step === 5 && (
              <div className="animate-fade-in-up">
                <CameraTab data={character.camera} mode="edit" onChange={(p) => onFieldChange('camera', p)} />
              </div>
            )}

            {step === 6 && (
              <div className="animate-fade-in-up">
                <LightingTab data={character.lighting} mode="edit" onChange={(p) => onFieldChange('lighting', p)} />
              </div>
            )}

            {step === 7 && (
              <div className="animate-fade-in-up">
                <EnvironmentTab data={character.environment} mode="edit" onChange={(p) => onFieldChange('environment', p)} />
              </div>
            )}

            {step === 8 && (
              <div className="animate-fade-in-up">
                <LoraTab data={character.lora} mode="edit" onChange={(p) => onFieldChange('lora', p)} />
              </div>
            )}

            {step === 9 && (
              <div className="flex flex-col items-center gap-6 animate-fade-in-up">
                <div className="text-center">
                  <h2 className="text-lg font-bold text-foreground">Character DNA is ready</h2>
                  <p className="text-sm text-foreground-muted">Review everything below, then bring {character.name || 'this character'} to life.</p>
                </div>
                <CharacterDnaCard character={previewCharacter} />
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
            <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} className={step === 0 ? 'invisible' : ''}>
              <ArrowLeft />
              Back
            </Button>

            <div className="flex flex-1 flex-wrap items-center justify-end gap-2.5">
              <Button variant="secondary" onClick={() => setPreviewOpen(true)}>
                <Eye />
                Preview
              </Button>
              <Button variant="secondary" loading={savingDraft} onClick={saveDraft}>
                <Save />
                {savingDraft ? 'Saving…' : 'Save draft'}
              </Button>
              {step === steps.length - 1 ? (
                <Button onClick={create} loading={creating}>
                  <Sparkles />
                  {creating ? 'Creating character…' : 'Create character'}
                </Button>
              ) : (
                <Button onClick={next}>
                  Continue
                  <ArrowRight />
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>

      <CharacterPreviewDialog character={previewCharacter} open={previewOpen} onOpenChange={setPreviewOpen} />
    </div>
  )
}
