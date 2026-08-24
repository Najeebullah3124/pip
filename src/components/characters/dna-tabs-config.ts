import {
  UserRound,
  Brain,
  Mic,
  Shirt,
  Aperture,
  Sun,
  Mountain,
  Layers,
  BookOpen,
  type LucideIcon,
} from 'lucide-react'

export interface DnaTabDef {
  key: string
  label: string
  icon: LucideIcon
}

export const dnaTabs: DnaTabDef[] = [
  { key: 'appearance', label: 'Appearance', icon: UserRound },
  { key: 'personality', label: 'Personality', icon: Brain },
  { key: 'voice', label: 'Voice', icon: Mic },
  { key: 'wardrobe', label: 'Wardrobe', icon: Shirt },
  { key: 'camera', label: 'Camera', icon: Aperture },
  { key: 'lighting', label: 'Lighting', icon: Sun },
  { key: 'environment', label: 'Environment', icon: Mountain },
  { key: 'lora', label: 'LoRA', icon: Layers },
  { key: 'memory', label: 'Memory', icon: BookOpen },
]
