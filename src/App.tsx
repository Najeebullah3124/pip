import { Routes, Route } from 'react-router-dom'
import { AppShell } from '@/components/layout/app-shell'
import DashboardPage from '@/pages/dashboard'
import DesignSystemPage from '@/pages/design-system'
import { PlaceholderPage } from '@/pages/placeholder'
import LoginPage from '@/pages/auth/login'
import RegisterPage from '@/pages/auth/register'
import ForgotPasswordPage from '@/pages/auth/forgot-password'
import ResetPasswordPage from '@/pages/auth/reset-password'
import VerifyEmailPage from '@/pages/auth/verify-email'
import OnboardingPage from '@/pages/onboarding'
import { RequireAuth, RequireGuest, RequireOnboardingAccess } from '@/components/auth/route-guards'
import { SessionLoadingScreen } from '@/components/auth/session-loading-screen'
import { useAuth } from '@/lib/auth/auth-context'
import AdminLayout from '@/pages/admin/layout'
import AdminOverviewPage from '@/pages/admin/overview'
import AdminUsersPage from '@/pages/admin/users'
import AdminRolesPage from '@/pages/admin/roles'
import AdminPermissionsPage from '@/pages/admin/permissions'
import AdminAiProvidersPage from '@/pages/admin/ai-providers'
import AdminRoutingEnginePage from '@/pages/admin/routing-engine'
import AdminSystemSettingsPage from '@/pages/admin/system-settings'
import AdminApiKeysPage from '@/pages/admin/api-keys'
import AdminAuditLogsPage from '@/pages/admin/audit-logs'
import AdminBackupRestorePage from '@/pages/admin/backup-restore'
import CharacterGalleryPage from '@/pages/characters/gallery'
import CharacterCreatePage from '@/pages/characters/new'
import CharacterDetailPage from '@/pages/characters/detail'
import CharacterEditorPage from '@/pages/characters/editor'
import ComponentsPage from '@/pages/components'
import PromptLibraryGalleryPage from '@/pages/prompt-library/gallery'
import TemplateDetailPage from '@/pages/prompt-library/detail'
import PromptStudioPage from '@/pages/prompt-studio'
import EnginesGalleryPage from '@/pages/engines/gallery'
import EngineDetailPage from '@/pages/engines/detail'
import { NexaLayout } from '@/components/nexapersona/nexa-layout'
import NexaDashboardPage from '@/pages/nexapersona/dashboard'
import NexaCharactersPage from '@/pages/nexapersona/characters'
import GenerationStudioPage from '@/pages/nexapersona/generation-studio'
import ProductPlacementPage from '@/pages/nexapersona/product-placement'
import SocialMediaPage from '@/pages/nexapersona/social-media'
import NexaLoraPage from '@/pages/nexapersona/lora'
import NexaMediaLibraryPage from '@/pages/nexapersona/media-library'
import MediaLibraryGalleryPage from '@/pages/media-library/gallery'
import MediaLibraryDetailPage from '@/pages/media-library/detail'
import { AnimoviaLayout } from '@/components/animovia/animovia-layout'
import AnimoviaDashboardPage from '@/pages/animovia/dashboard'
import AnimoviaProjectsPage from '@/pages/animovia/projects'
import StoryBuilderPage from '@/pages/animovia/story-builder'
import AnimoviaCharactersPage from '@/pages/animovia/characters'
import IllustrationsPage from '@/pages/animovia/illustrations'
import CoversPage from '@/pages/animovia/covers'
import BooksPage from '@/pages/animovia/books'
import BookBuilderPage from '@/pages/animovia/book-builder'
import NarrationPage from '@/pages/animovia/narration'
import BookToVideoPage from '@/pages/animovia/book-to-video'
import ExportsPage from '@/pages/animovia/exports'
import { PrivateLayout } from '@/components/private/private-layout'
import PrivateDashboardPage from '@/pages/private/dashboard'
import PrivatePromptStudioPage from '@/pages/private/prompt-studio'
import PrivatePromptBuilderPage from '@/pages/private/prompt-builder'
import PrivatePromptTesterPage from '@/pages/private/prompt-tester'
import PrivatePromptOptimizerPage from '@/pages/private/prompt-optimizer'
import PrivatePromptLibraryPage from '@/pages/private/prompt-library'
import PrivateComponentsPage from '@/pages/private/components'
import PrivateCharacterDnaPage from '@/pages/private/character-dna'
import PrivateCharacterMemoryPage from '@/pages/private/character-memory'
import PrivateLoraManagerPage from '@/pages/private/lora-manager'
import PrivateAiEnginesPage from '@/pages/private/ai-engines'
import PrivateProductPlacementPage from '@/pages/private/product-placement'
import PrivateSocialMediaPage from '@/pages/private/social-media'
import { FolderKanban } from 'lucide-react'

function App() {
  const { status } = useAuth()

  if (status === 'loading') {
    return <SessionLoadingScreen />
  }

  return (
    <Routes>
      <Route path="/login" element={<RequireGuest><LoginPage /></RequireGuest>} />
      <Route path="/register" element={<RequireGuest><RegisterPage /></RequireGuest>} />
      <Route path="/forgot-password" element={<RequireGuest><ForgotPasswordPage /></RequireGuest>} />
      <Route path="/reset-password" element={<RequireGuest><ResetPasswordPage /></RequireGuest>} />
      <Route path="/verify-email" element={<RequireGuest><VerifyEmailPage /></RequireGuest>} />
      <Route path="/onboarding" element={<RequireOnboardingAccess><OnboardingPage /></RequireOnboardingAccess>} />

      <Route element={<RequireAuth><AppShell /></RequireAuth>}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/design-system" element={<DesignSystemPage />} />
        <Route path="/prompt-studio" element={<PromptStudioPage />} />
        <Route path="/prompt-library" element={<PromptLibraryGalleryPage />} />
        <Route path="/prompt-library/:id" element={<TemplateDetailPage />} />
        <Route path="/components" element={<ComponentsPage />} />
        <Route path="/characters" element={<CharacterGalleryPage />} />
        <Route path="/characters/new" element={<CharacterCreatePage />} />
        <Route path="/characters/:id/edit" element={<CharacterEditorPage />} />
        <Route path="/characters/:id" element={<CharacterDetailPage />} />
        <Route path="/ai-engines" element={<EnginesGalleryPage />} />
        <Route path="/ai-engines/:id" element={<EngineDetailPage />} />
        <Route
          path="/projects"
          element={
            <PlaceholderPage
              title="Projects"
              description="Group prompts, characters, and media into shipped initiatives."
              icon={FolderKanban}
              breadcrumbs={[{ label: 'Projects' }]}
            />
          }
        />
        <Route path="/media-library" element={<MediaLibraryGalleryPage />} />
        <Route path="/media-library/:id" element={<MediaLibraryDetailPage />} />
        <Route path="/nexapersona" element={<NexaLayout />}>
          <Route index element={<NexaDashboardPage />} />
          <Route path="characters" element={<NexaCharactersPage />} />
          <Route path="studio" element={<GenerationStudioPage />} />
          <Route path="product-placement" element={<ProductPlacementPage />} />
          <Route path="social-media" element={<SocialMediaPage />} />
          <Route path="lora" element={<NexaLoraPage />} />
          <Route path="media-library" element={<NexaMediaLibraryPage />} />
        </Route>
        <Route path="/animovia" element={<AnimoviaLayout />}>
          <Route index element={<AnimoviaDashboardPage />} />
          <Route path="projects" element={<AnimoviaProjectsPage />} />
          <Route path="story-builder" element={<StoryBuilderPage />} />
          <Route path="characters" element={<AnimoviaCharactersPage />} />
          <Route path="illustrations" element={<IllustrationsPage />} />
          <Route path="covers" element={<CoversPage />} />
          <Route path="books" element={<BooksPage />} />
          <Route path="book-builder/:bookId" element={<BookBuilderPage />} />
          <Route path="narration" element={<NarrationPage />} />
          <Route path="book-to-video" element={<BookToVideoPage />} />
          <Route path="exports" element={<ExportsPage />} />
        </Route>
        <Route path="/private-platform" element={<PrivateLayout />}>
          <Route index element={<PrivateDashboardPage />} />
          <Route path="prompt-studio" element={<PrivatePromptStudioPage />} />
          <Route path="prompt-builder" element={<PrivatePromptBuilderPage />} />
          <Route path="prompt-tester" element={<PrivatePromptTesterPage />} />
          <Route path="prompt-optimizer" element={<PrivatePromptOptimizerPage />} />
          <Route path="prompt-library" element={<PrivatePromptLibraryPage />} />
          <Route path="components" element={<PrivateComponentsPage />} />
          <Route path="character-dna" element={<PrivateCharacterDnaPage />} />
          <Route path="character-memory" element={<PrivateCharacterMemoryPage />} />
          <Route path="lora-manager" element={<PrivateLoraManagerPage />} />
          <Route path="ai-engines" element={<PrivateAiEnginesPage />} />
          <Route path="product-placement" element={<PrivateProductPlacementPage />} />
          <Route path="social-media" element={<PrivateSocialMediaPage />} />
        </Route>
        <Route path="/administration" element={<AdminLayout />}>
          <Route index element={<AdminOverviewPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="roles" element={<AdminRolesPage />} />
          <Route path="permissions" element={<AdminPermissionsPage />} />
          <Route path="ai-providers" element={<AdminAiProvidersPage />} />
          <Route path="routing-engine" element={<AdminRoutingEnginePage />} />
          <Route path="system-settings" element={<AdminSystemSettingsPage />} />
          <Route path="api-keys" element={<AdminApiKeysPage />} />
          <Route path="audit-logs" element={<AdminAuditLogsPage />} />
          <Route path="backup-restore" element={<AdminBackupRestorePage />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
