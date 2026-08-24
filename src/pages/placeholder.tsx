import type { LucideIcon } from 'lucide-react'
import { Sparkles } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { EmptyState } from '@/components/shared/empty-state'
import { Button } from '@/components/ui/button'
import type { Crumb } from '@/components/shared/breadcrumbs'

interface PlaceholderPageProps {
  title: string
  description: string
  icon: LucideIcon
  breadcrumbs: Crumb[]
}

export function PlaceholderPage({ title, description, icon: Icon, breadcrumbs }: PlaceholderPageProps) {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={title} description={description} icon={<Icon />} breadcrumbs={breadcrumbs} />
      <EmptyState
        icon={<Sparkles />}
        title="This module is under construction"
        description={`${title} is part of the PIP roadmap. The design system and shell are ready — this page will be built out next.`}
        action={
          <Button variant="secondary" size="sm">
            View roadmap
          </Button>
        }
      />
    </div>
  )
}
