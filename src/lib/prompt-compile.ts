import { getTemplate } from '@/data/template-data'
import { getCharacter } from '@/data/character-data'
import { getComponent } from '@/data/component-data'

export interface CompiledPackage {
  system: string
  prompt: string
  negative: string
  tokens: number
  componentNames: string[]
  characterName: string | null
  templateName: string | null
  engine: string
}

export interface CompileInput {
  templateId: string | null
  characterId: string | null
  componentIds: string[]
  engine: string
  variables: Record<string, string>
}

const VAR_RE = /\{\{(\w+)\}\}/g

export function extractVariableNames(text: string): string[] {
  return [...new Set([...text.matchAll(VAR_RE)].map((m) => m[1]))]
}

export function compilePackage(input: CompileInput): CompiledPackage {
  const template = input.templateId ? getTemplate(input.templateId) : undefined
  const character = input.characterId ? getCharacter(input.characterId) : undefined
  const components = input.componentIds.map((id) => getComponent(id)).filter((c): c is NonNullable<typeof c> => !!c)

  const system = character
    ? `You are ${character.name}, ${character.personality.archetype.toLowerCase()}. ${character.personality.tone}. Maintain identity consistency across every generation.`
    : 'You are generating on-brand content for PIP. Maintain consistency and follow brand guidelines.'

  let prompt = template ? template.content.replace(VAR_RE, (_, name) => input.variables[name] || `[${name}]`) : ''
  if (components.length) {
    prompt += `${prompt ? ' ' : ''}Incorporating: ${components.map((c) => `[[${c.name}]]`).join(', ')}.`
  }

  const negative = 'blurry, watermark, low quality, inconsistent identity, extra limbs'
  const tokens = Math.max(1, Math.ceil((system.length + prompt.length + negative.length) / 4))

  return {
    system,
    prompt,
    negative,
    tokens,
    componentNames: components.map((c) => c.name),
    characterName: character?.name ?? null,
    templateName: template?.name ?? null,
    engine: input.engine,
  }
}

export interface OptimizeResult {
  package: CompiledPackage
  improvements: string[]
  changedSections: string[]
}

const GUARD_COMPONENT_NAME = 'Standard Quality Guard'

export function optimizePackage(pkg: CompiledPackage): OptimizeResult {
  const improvements: string[] = []
  const changedSections: string[] = []

  const guardrailTerms = ['oversaturated colors', 'harsh shadows', 'text artifacts', 'duplicate limbs']
  const missing = guardrailTerms.filter((g) => !pkg.negative.includes(g))
  let negative = pkg.negative
  if (missing.length) {
    negative = `${negative}, ${missing.join(', ')}`
    changedSections.push('Negative prompt')
    improvements.push(`Added ${missing.length} quality guardrail${missing.length > 1 ? 's' : ''} to the negative prompt`)
  }

  let prompt = pkg.prompt
  if (!prompt.includes('ultra-detailed')) {
    prompt = `${prompt} Rendered ultra-detailed and professionally composed.`
    changedSections.push('Prompt')
    improvements.push('Strengthened composition and fidelity guidance in the prompt body')
  }

  const componentNames = [...pkg.componentNames]
  if (!componentNames.includes(GUARD_COMPONENT_NAME)) {
    componentNames.push(GUARD_COMPONENT_NAME)
    changedSections.push('Components')
    improvements.push(`Attached "${GUARD_COMPONENT_NAME}" component for baseline output quality`)
  }

  const tokens = Math.max(1, Math.ceil((pkg.system.length + prompt.length + negative.length) / 4))

  return {
    package: { ...pkg, prompt, negative, componentNames, tokens },
    improvements,
    changedSections,
  }
}

export function qualityScore(pkg: CompiledPackage, variables: Record<string, string>): number {
  let score = 60
  if (pkg.negative.length > 60) score += 10
  if (pkg.componentNames.length >= 2) score += 8
  if (pkg.componentNames.includes(GUARD_COMPONENT_NAME)) score += 6
  if (pkg.characterName) score += 8
  const values = Object.values(variables)
  const filled = values.filter((v) => v.trim()).length
  const total = values.length || 1
  score += Math.round((filled / total) * 14)
  return Math.min(100, score)
}
