import {
  LayoutGrid, Wand2, FlaskConical, TestTube2, SlidersHorizontal, Library, Blocks,
  UsersRound, Brain, Layers, Cpu, Package, Share2, type LucideIcon,
} from 'lucide-react'

export interface PrivateNavItem {
  key: string
  label: string
  href: string
  icon: LucideIcon
  end?: boolean
}

export const privateNavItems: PrivateNavItem[] = [
  { key: 'dashboard', label: 'Private Dashboard', href: '/private-platform', icon: LayoutGrid, end: true },
  { key: 'prompt-studio', label: 'Prompt Studio', href: '/private-platform/prompt-studio', icon: Wand2 },
  { key: 'prompt-builder', label: 'Prompt Builder', href: '/private-platform/prompt-builder', icon: FlaskConical },
  { key: 'prompt-tester', label: 'Prompt Tester', href: '/private-platform/prompt-tester', icon: TestTube2 },
  { key: 'prompt-optimizer', label: 'Prompt Optimizer', href: '/private-platform/prompt-optimizer', icon: SlidersHorizontal },
  { key: 'prompt-library', label: 'Prompt Library', href: '/private-platform/prompt-library', icon: Library },
  { key: 'components', label: 'Components', href: '/private-platform/components', icon: Blocks },
  { key: 'character-dna', label: 'Character DNA', href: '/private-platform/character-dna', icon: UsersRound },
  { key: 'character-memory', label: 'Character Memory', href: '/private-platform/character-memory', icon: Brain },
  { key: 'lora-manager', label: 'LoRA Manager', href: '/private-platform/lora-manager', icon: Layers },
  { key: 'ai-engines', label: 'AI Engines', href: '/private-platform/ai-engines', icon: Cpu },
  { key: 'product-placement', label: 'Product Placement', href: '/private-platform/product-placement', icon: Package },
  { key: 'social-media', label: 'Social Media', href: '/private-platform/social-media', icon: Share2 },
]
