import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PrivateAssetGalleryPage } from '@/components/private/private-asset-gallery-page'

export default function PrivateLoraManagerPage() {
  return (
    <Tabs defaultValue="lora">
      <div className="mb-4">
        <TabsList>
          <TabsTrigger value="lora">LoRA Models</TabsTrigger>
          <TabsTrigger value="voices">Private Voices</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="lora">
        <PrivateAssetGalleryPage kind="LoRA" description="Experimental identity models and training runs, kept private until a version is promoted to a character's public LoRA." createLabel="New LoRA run" />
      </TabsContent>

      <TabsContent value="voices">
        <PrivateAssetGalleryPage kind="Voice" description="Voice tuning drafts and accent variants under internal review before publishing to a character's voice profile." createLabel="New voice draft" />
      </TabsContent>
    </Tabs>
  )
}
