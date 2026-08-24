import {
  LayoutGrid, UsersRound, Wand2, Package, Share2, Layers, Images,
  type LucideIcon,
} from 'lucide-react'

export interface NexaNavItem {
  key: string
  label: string
  href: string
  icon: LucideIcon
  end?: boolean
}

export const nexaNavItems: NexaNavItem[] = [
  { key: 'dashboard', label: 'Dashboard', href: '/nexapersona', icon: LayoutGrid, end: true },
  { key: 'characters', label: 'Characters', href: '/nexapersona/characters', icon: UsersRound },
  { key: 'studio', label: 'Generation Studio', href: '/nexapersona/studio', icon: Wand2 },
  { key: 'product-placement', label: 'Product Placement', href: '/nexapersona/product-placement', icon: Package },
  { key: 'social-media', label: 'Social Media', href: '/nexapersona/social-media', icon: Share2 },
  { key: 'lora', label: 'LoRA', href: '/nexapersona/lora', icon: Layers },
  { key: 'media-library', label: 'Media Library', href: '/nexapersona/media-library', icon: Images },
]
