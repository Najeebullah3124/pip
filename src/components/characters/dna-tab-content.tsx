import { AppearanceTab } from '@/components/characters/tabs/appearance-tab'
import { PersonalityTab } from '@/components/characters/tabs/personality-tab'
import { VoiceTab } from '@/components/characters/tabs/voice-tab'
import { WardrobeTab } from '@/components/characters/tabs/wardrobe-tab'
import { CameraTab } from '@/components/characters/tabs/camera-tab'
import { LightingTab } from '@/components/characters/tabs/lighting-tab'
import { EnvironmentTab } from '@/components/characters/tabs/environment-tab'
import { LoraTab } from '@/components/characters/tabs/lora-tab'
import { MemoryTab } from '@/components/characters/tabs/memory-tab'
import type { Character } from '@/data/character-data'

interface DnaTabContentProps {
  tabKey: string
  character: Character
  mode: 'view' | 'edit'
  onFieldChange: (section: keyof Character, patch: Record<string, unknown>) => void
}

export function DnaTabContent({ tabKey, character, mode, onFieldChange }: DnaTabContentProps) {
  switch (tabKey) {
    case 'appearance':
      return <AppearanceTab data={character.appearance} mode={mode} onChange={(p) => onFieldChange('appearance', p)} />
    case 'personality':
      return <PersonalityTab data={character.personality} mode={mode} onChange={(p) => onFieldChange('personality', p)} />
    case 'voice':
      return <VoiceTab data={character.voice} mode={mode} onChange={(p) => onFieldChange('voice', p)} />
    case 'wardrobe':
      return <WardrobeTab data={character.wardrobe} mode={mode} onChange={(p) => onFieldChange('wardrobe', p)} />
    case 'camera':
      return <CameraTab data={character.camera} mode={mode} onChange={(p) => onFieldChange('camera', p)} />
    case 'lighting':
      return <LightingTab data={character.lighting} mode={mode} onChange={(p) => onFieldChange('lighting', p)} />
    case 'environment':
      return <EnvironmentTab data={character.environment} mode={mode} onChange={(p) => onFieldChange('environment', p)} />
    case 'lora':
      return <LoraTab data={character.lora} mode={mode} onChange={(p) => onFieldChange('lora', p)} />
    case 'memory':
      return <MemoryTab data={character.memory} mode={mode} onChange={(p) => onFieldChange('memory', p)} />
    default:
      return null
  }
}
