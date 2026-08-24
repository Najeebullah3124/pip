import { characters } from './character-data'

export type PlacementStyle = 'Hero shot' | 'Lifestyle integration' | 'Unboxing' | 'Comparison layout' | 'Background integration' | 'Close-up detail'
export type CampaignStatus = 'Draft' | 'Generated'

export interface Campaign {
  id: string
  brand: string
  product: string
  placementStyle: PlacementStyle
  marketingNotes: string
  cta: string
  characterId: string | null
  environment: string
  markerX: number
  markerY: number
  scale: number
  status: CampaignStatus
  resultId: string | null
  createdAt: string
}

export const placementStyles: PlacementStyle[] = [
  'Hero shot',
  'Lifestyle integration',
  'Unboxing',
  'Comparison layout',
  'Background integration',
  'Close-up detail',
]

export const placementEnvironments = ['Modern studio', 'Sunlit loft', 'Urban rooftop', 'Minimal cyclorama', 'Cozy library', 'Outdoor lifestyle']

function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}
function pick<T>(arr: readonly T[], rand: () => number): T {
  return arr[Math.floor(rand() * arr.length)]
}

const seedCampaigns: { brand: string; product: string; cta: string; notes: string }[] = [
  { brand: 'Aurora Audio', product: 'Aurora Wireless Headphones', cta: 'Shop now', notes: 'Emphasize noise cancellation and the matte finish. Keep the mood calm and premium.' },
  { brand: 'Verdant', product: 'Verdant Cold Brew Concentrate', cta: 'Try it today', notes: 'Highlight the eco-friendly packaging. Morning routine, natural light.' },
  { brand: 'Fleetfoot', product: 'Fleetfoot Trail Runners', cta: 'Get 20% off', notes: 'Outdoor, high energy, show the shoe in motion or mid-stride.' },
  { brand: 'Lumen Skincare', product: 'Lumen Glow Serum', cta: 'Discover your glow', notes: 'Soft, minimal, dewy skin close-up. Keep it clean and clinical.' },
  { brand: 'Northstar Watches', product: 'Northstar Voyager', cta: 'Explore the collection', notes: 'Aspirational, travel-adjacent, wrist close-up with a confident pose.' },
  { brand: 'Cirrus', product: 'Cirrus Smart Backpack', cta: 'Pack smarter', notes: 'Urban commuter setting, show the laptop compartment and USB port.' },
  { brand: 'Petal & Pine', product: 'Petal & Pine Candle Set', cta: 'Light it up', notes: 'Cozy home setting, warm tones, evening ambiance.' },
  { brand: 'Kinetic Labs', product: 'Kinetic Smart Ring', cta: 'Preorder now', notes: 'Tech-forward, sleek hand close-up against a dark background.' },
]

export const campaigns: Campaign[] = seedCampaigns.map((c, i) => {
  const rand = seededRandom(i * 17 + 5)
  const character = pick(characters.slice(0, 12), rand)
  const status: CampaignStatus = rand() > 0.3 ? 'Generated' : 'Draft'
  return {
    id: `campaign_${(i + 1).toString().padStart(3, '0')}`,
    brand: c.brand,
    product: c.product,
    placementStyle: pick(placementStyles, rand),
    marketingNotes: c.notes,
    cta: c.cta,
    characterId: character.id,
    environment: pick(placementEnvironments, rand),
    markerX: Math.round(30 + rand() * 40),
    markerY: Math.round(35 + rand() * 35),
    scale: Math.round((0.8 + rand() * 0.5) * 100) / 100,
    status,
    resultId: status === 'Generated' ? `media_pp_seed_${(i + 1).toString().padStart(3, '0')}` : null,
    createdAt: `${Math.floor(rand() * 20) + 1}d ago`,
  }
})

export function addCampaign(campaign: Campaign) {
  campaigns.unshift(campaign)
}

export function updateCampaign(id: string, patch: Partial<Campaign>) {
  const idx = campaigns.findIndex((c) => c.id === id)
  if (idx === -1) return
  campaigns[idx] = { ...campaigns[idx], ...patch }
}

export function getCampaign(id: string): Campaign | undefined {
  return campaigns.find((c) => c.id === id)
}
