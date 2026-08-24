import { PrivateAssetGalleryPage } from '@/components/private/private-asset-gallery-page'

export default function PrivateAiEnginesPage() {
  return (
    <PrivateAssetGalleryPage
      kind="Engine"
      description="Unreleased models, cost benchmarks, and latency evaluations — kept private until an engine is ready for the shared AI Engine Manager."
      createLabel="New engine evaluation"
    />
  )
}
