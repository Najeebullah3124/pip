import { AssetGalleryPage } from '@/components/animovia/asset-gallery-page'

export default function CoversPage() {
  return (
    <AssetGalleryPage
      kind="Cover"
      description="Front and back cover artwork for each storybook, ready for print or digital publishing."
      generateLabel="New cover"
      generateHint="Pick a story to generate cover artwork for."
    />
  )
}
