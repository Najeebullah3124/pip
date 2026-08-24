import {
  LayoutDashboard,
  Wand2,
  Library,
  Blocks,
  UsersRound,
  Cpu,
  FolderKanban,
  Images,
  Fingerprint,
  Clapperboard,
  ShieldCheck,
  Settings2,
  Palette,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
  badge?: string
}

export interface NavSection {
  label?: string
  items: NavItem[]
}

export const primaryNav: NavSection[] = [
  {
    label: 'Workspace',
    items: [
      { label: 'Dashboard', href: '/', icon: LayoutDashboard },
      { label: 'Prompt Studio', href: '/prompt-studio', icon: Wand2 },
      { label: 'Prompt Library', href: '/prompt-library', icon: Library },
      { label: 'Components', href: '/components', icon: Blocks },
      { label: 'Characters', href: '/characters', icon: UsersRound },
      { label: 'AI Engines', href: '/ai-engines', icon: Cpu },
      { label: 'Projects', href: '/projects', icon: FolderKanban },
      { label: 'Media Library', href: '/media-library', icon: Images },
    ],
  },
  {
    label: 'Platform',
    items: [
      { label: 'NexaPersona', href: '/nexapersona', icon: Fingerprint, badge: 'New' },
      { label: 'Animovia', href: '/animovia', icon: Clapperboard, badge: 'New' },
      { label: 'Private Platform', href: '/private-platform', icon: ShieldCheck },
    ],
  },
]

export const bottomNav: NavSection[] = [
  {
    items: [
      { label: 'Design System', href: '/design-system', icon: Palette },
      { label: 'Administration', href: '/administration', icon: Settings2 },
    ],
  },
]

export const allNavItems: NavItem[] = [...primaryNav, ...bottomNav].flatMap((s) => s.items)
