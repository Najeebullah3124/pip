import {
  LayoutGrid, FolderKanban, Wand2, UsersRound, Image, BookImage, BookOpen, Mic, Clapperboard, FileDown,
  type LucideIcon,
} from 'lucide-react'

export interface AnimoviaNavItem {
  key: string
  label: string
  href: string
  icon: LucideIcon
  end?: boolean
}

export const animoviaNavItems: AnimoviaNavItem[] = [
  { key: 'dashboard', label: 'Dashboard', href: '/animovia', icon: LayoutGrid, end: true },
  { key: 'projects', label: 'Projects', href: '/animovia/projects', icon: FolderKanban },
  { key: 'story-builder', label: 'Story Builder', href: '/animovia/story-builder', icon: Wand2 },
  { key: 'characters', label: 'Characters', href: '/animovia/characters', icon: UsersRound },
  { key: 'illustrations', label: 'Illustrations', href: '/animovia/illustrations', icon: Image },
  { key: 'covers', label: 'Covers', href: '/animovia/covers', icon: BookImage },
  { key: 'books', label: 'Books', href: '/animovia/books', icon: BookOpen },
  { key: 'narration', label: 'Narration', href: '/animovia/narration', icon: Mic },
  { key: 'book-to-video', label: 'Book-to-Video', href: '/animovia/book-to-video', icon: Clapperboard },
  { key: 'exports', label: 'Exports', href: '/animovia/exports', icon: FileDown },
]
