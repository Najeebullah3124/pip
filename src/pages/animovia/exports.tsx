import { AssetGalleryPage } from '@/components/animovia/asset-gallery-page'

export default function ExportsPage() {
  return (
    <AssetGalleryPage
      kind="Export"
      description="Finished exports of your storybooks — PDF, print-ready PDF, and PNG page sets."
      generateLabel="New export"
      generateHint="Pick a story to export its finished book."
    />
  )
}
