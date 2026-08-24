import { AssetGalleryPage } from '@/components/animovia/asset-gallery-page'

export default function IllustrationsPage() {
  return (
    <AssetGalleryPage
      kind="Illustration"
      description="Scene-by-scene artwork generated for your storybooks, styled consistently with each character's identity."
      generateLabel="New illustration"
      generateHint="Pick a story to generate the next scene illustration for."
    />
  )
}
