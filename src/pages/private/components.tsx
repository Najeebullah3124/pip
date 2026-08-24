import { PrivateAssetGalleryPage } from '@/components/private/private-asset-gallery-page'

export default function PrivateComponentsPage() {
  return (
    <PrivateAssetGalleryPage
      kind="Component"
      description="Prompt fragments, guardrails, and style modifiers under internal review before promotion to the shared Component Library."
      createLabel="New component"
    />
  )
}
