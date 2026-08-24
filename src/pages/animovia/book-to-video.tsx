import { AssetGalleryPage } from '@/components/animovia/asset-gallery-page'

export default function BookToVideoPage() {
  return (
    <AssetGalleryPage
      kind="Book-to-Video"
      description="Animated video adaptations of your storybooks, combining illustrations, motion, and narration."
      generateLabel="New video"
      generateHint="Pick a story to turn into an animated book-to-video."
    />
  )
}
