import { AssetGalleryPage } from '@/components/animovia/asset-gallery-page'

export default function NarrationPage() {
  return (
    <AssetGalleryPage
      kind="Narration"
      description="Narrated audio readers for each storybook, voiced in-character for read-along experiences."
      generateLabel="New narration"
      generateHint="Pick a story to generate a full narrated reading for."
    />
  )
}
