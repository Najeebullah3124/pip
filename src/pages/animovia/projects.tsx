import * as React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Wand2, BookOpen } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { CharacterPicker } from '@/components/nexapersona/character-picker'
import { projects as seedProjects, addProject, getStory, type Project, type ProjectStatus } from '@/data/animovia-data'
import { getCharacter } from '@/data/character-data'

const statusVariant: Record<ProjectStatus, 'outline' | 'accent' | 'success'> = {
  Planning: 'outline',
  Story: 'accent',
  Illustration: 'accent',
  Layout: 'accent',
  Published: 'success',
}

export default function ProjectsPage() {
  const navigate = useNavigate()
  const [projects, setProjects] = React.useState<Project[]>(() => [...seedProjects])
  const [open, setOpen] = React.useState(false)
  const [title, setTitle] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [characterId, setCharacterId] = React.useState<string | null>(null)

  function createProject(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    const project: Project = {
      id: `project_new_${Date.now()}`,
      title: title.trim(),
      description: description.trim() || 'A new storybook project, ready for its story.',
      status: 'Planning',
      storyId: null,
      characterIds: characterId ? [characterId] : [],
      gradientFrom: '#a78bfa',
      gradientTo: '#7c3aed',
      createdAt: 'Just now',
      updatedAt: 'Just now',
    }
    addProject(project)
    setProjects((prev) => [project, ...prev])
    setOpen(false)
    setTitle('')
    setDescription('')
    setCharacterId(null)
    navigate(`/animovia/story-builder?project=${project.id}`)
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-foreground-muted">Projects tie a story, its characters, and its finished book together from idea to export.</p>
        <Button onClick={() => setOpen(true)}>
          <Plus />
          New project
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => {
          const story = project.storyId ? getStory(project.storyId) : undefined
          const chars = project.characterIds.map((id) => getCharacter(id)).filter(Boolean)
          return (
            <Card key={project.id} className="flex flex-col overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-elevation-2">
              <div
                className="relative h-20 w-full"
                style={{ background: `linear-gradient(135deg, ${project.gradientFrom}, ${project.gradientTo})` }}
              >
                <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_25%_25%,white_1px,transparent_1px)] [background-size:14px_14px]" />
              </div>
              <div className="flex flex-1 flex-col gap-3 p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-foreground">{project.title}</p>
                  <Badge variant={statusVariant[project.status]} className="shrink-0">
                    {project.status}
                  </Badge>
                </div>
                <p className="line-clamp-2 text-xs text-foreground-subtle">{project.description}</p>

                {story ? (
                  <Link
                    to={`/animovia/story-builder?project=${project.id}&story=${story.id}`}
                    className="flex items-center gap-1.5 text-xs font-medium text-accent hover:underline"
                  >
                    <BookOpen className="size-3.5" />
                    {story.title}
                  </Link>
                ) : (
                  <Link to={`/animovia/story-builder?project=${project.id}`} className="flex items-center gap-1.5 text-xs font-medium text-accent hover:underline">
                    <Wand2 className="size-3.5" />
                    Start the story
                  </Link>
                )}

                <div className="mt-auto flex items-center justify-between border-t border-border pt-3">
                  <div className="flex -space-x-2">
                    {chars.slice(0, 4).map((c) => (
                      <div
                        key={c!.id}
                        className="flex size-6 items-center justify-center rounded-full border-2 border-card text-[9px] font-bold text-white"
                        style={{ background: `linear-gradient(135deg, ${c!.gradientFrom}, ${c!.gradientTo})` }}
                        title={c!.name}
                      >
                        {c!.name.slice(0, 1)}
                      </div>
                    ))}
                    {chars.length === 0 && <span className="text-[11px] text-foreground-subtle">No characters yet</span>}
                  </div>
                  <span className="text-[11px] text-foreground-subtle">Updated {project.updatedAt}</span>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New project</DialogTitle>
            <DialogDescription>Give your storybook project a name — you'll build out the story next.</DialogDescription>
          </DialogHeader>
          <form onSubmit={createProject} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="proj-title">Title</Label>
              <Input id="proj-title" placeholder="e.g. Luma's Forest Friends" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="proj-desc">Description</Label>
              <Textarea id="proj-desc" placeholder="What is this project about?" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Lead character (optional)</Label>
              <CharacterPicker value={characterId} onChange={setCharacterId} />
            </div>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!title.trim()}>
                <Wand2 />
                Create & start story
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
