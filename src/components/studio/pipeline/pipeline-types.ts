export type NodeKey = 'request' | 'template' | 'character' | 'components' | 'settings' | 'package'
export type NodeStatus = 'idle' | 'active' | 'done'

export interface PipelineState {
  request: string
  templateId: string | null
  characterId: string | null
  componentIds: string[]
  engine: string
  temperature: number
  topP: number
  maxTokens: number
}

export type ExecStatus = 'pending' | 'active' | 'done'

export interface ExecStep {
  key: string
  label: string
  status: ExecStatus
  timestamp: string | null
}

export const execStepDefs = [
  'Request received',
  'Template loaded',
  'Character loaded',
  'Components loaded',
  'AI settings applied',
  'Package generated',
  'Completed',
] as const
