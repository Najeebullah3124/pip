export interface StudioVersion {
  version: string
  changelog: string
  updatedAt: string
  snapshot: {
    promptBody: string
    systemInstructions: string
    negativePrompt: string
    variables: Record<string, string>
  }
}

export interface StudioPrompt {
  name: string
  status: 'Draft' | 'Published'
  version: string
  promptBody: string
  systemInstructions: string
  negativePrompt: string
  variables: Record<string, string>
  componentIds: string[]
  characterId: string | null
  aiEngine: string
  aiSettings: { temperature: number; topP: number; maxTokens: number }
  versions: StudioVersion[]
}
