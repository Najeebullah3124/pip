import type { GenerationType } from './nexapersona-data'

export const wardrobeStyles = ['Minimal tailored', 'Streetwear', 'Business casual', 'Editorial avant-garde', 'Soft athleisure']
export const cameraAngles = ['Eye-level portrait', 'Three-quarter', 'Low-angle heroic', 'Over-the-shoulder', 'Dutch tilt']
export const lightingStyles = ['Soft studio softbox', 'Golden hour rim light', 'High-contrast rembrandt', 'Flat even light', 'Neon practical']
export const environments = ['Modern studio', 'Sunlit loft', 'Urban rooftop', 'Minimal cyclorama', 'Cozy library']
export const voicePresets = ['Warm Narrator', 'Crisp Professional', 'Playful Energetic', 'Calm Assistant', 'Bold Confident']
export const motionPresets = ['Subtle', 'Natural', 'Dynamic', 'Cinematic']

export const resolutionsByType: Record<GenerationType, string[]> = {
  Image: ['512×512', '1024×1024', '1536×1536', '2048×2048'],
  Video: ['720p', '1080p', '4K'],
  'Talking Head': ['720p', '1080p', '4K'],
  Voice: ['22kHz', '44kHz', '48kHz'],
  'Lip Sync': ['720p', '1080p', '4K'],
  'Product Placement': ['1024×1024', '1536×1536'],
  'Social Media': ['1024×1024'],
}

export const aspectRatiosByType: Partial<Record<GenerationType, string[]>> = {
  Image: ['1:1', '4:5', '16:9', '9:16'],
  Video: ['16:9', '9:16', '1:1'],
  'Talking Head': ['1:1', '4:5', '16:9'],
  'Lip Sync': ['16:9', '9:16'],
}

export const showVoice = (type: GenerationType) => type === 'Voice' || type === 'Talking Head' || type === 'Lip Sync'
export const showMotion = (type: GenerationType) => type === 'Video' || type === 'Talking Head' || type === 'Lip Sync'
export const showAspectRatio = (type: GenerationType) => !!aspectRatiosByType[type]
