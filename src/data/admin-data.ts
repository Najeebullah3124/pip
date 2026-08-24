export type UserRole = 'Owner' | 'Admin' | 'Editor' | 'Member' | 'Viewer'
export type UserStatus = 'Active' | 'Invited' | 'Suspended' | 'Deactivated'

export interface AdminUser {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  lastActive: string
  createdAt: string
  projects: number
  twoFactor: boolean
}

const firstNames = [
  'Jordan', 'Amara', 'Priya', 'Emerson', 'Wei', 'Sofia', 'Marcus', 'Elena', 'Kenji', 'Fatima',
  'Liam', 'Noor', 'Diego', 'Ingrid', 'Tobias', 'Yuki', 'Chidi', 'Anastasia', 'Rowan', 'Mei',
  'Gabriel', 'Zara', 'Oskar', 'Leilani', 'Hassan', 'Freya', 'Kwame', 'Isla', 'Rafael', 'Nadia',
]
const lastNames = [
  'Lee', 'Chen', 'Nair', 'Sterling', 'Zhang', 'Moreau', 'Okafor', 'Petrova', 'Sato', 'Haddad',
  'Byrne', 'Farouk', 'Alvarez', 'Larsen', 'Weber', 'Tanaka', 'Adeyemi', 'Volkov', 'Kildare', 'Wong',
]
const roles: UserRole[] = ['Owner', 'Admin', 'Editor', 'Member', 'Viewer']
const statuses: UserStatus[] = ['Active', 'Active', 'Active', 'Active', 'Invited', 'Suspended', 'Deactivated']

function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

function pick<T>(arr: T[], rand: () => number): T {
  return arr[Math.floor(rand() * arr.length)]
}

function formatRelative(daysAgo: number, hoursAgo: number) {
  if (daysAgo === 0 && hoursAgo === 0) return 'Just now'
  if (daysAgo === 0) return `${hoursAgo}h ago`
  if (daysAgo === 1) return 'Yesterday'
  if (daysAgo < 30) return `${daysAgo}d ago`
  return `${Math.floor(daysAgo / 30)}mo ago`
}

function formatDate(daysAgo: number) {
  const d = new Date(2026, 7, 17)
  d.setDate(d.getDate() - daysAgo)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export const adminUsers: AdminUser[] = Array.from({ length: 47 }, (_, i) => {
  const rand = seededRandom(i + 1)
  const first = pick(firstNames, rand)
  const last = pick(lastNames, rand)
  const status = i === 0 ? 'Active' : pick(statuses, rand)
  const role = i === 0 ? 'Owner' : pick(roles, rand)
  const createdDaysAgo = Math.floor(rand() * 600) + 5
  const lastActiveDays = status === 'Deactivated' ? Math.floor(rand() * 200) + 60 : Math.floor(rand() * 20)
  const lastActiveHours = Math.floor(rand() * 24)

  return {
    id: `usr_${(i + 1).toString().padStart(3, '0')}`,
    name: `${first} ${last}`,
    email: `${first.toLowerCase()}.${last.toLowerCase()}@pip.ai`,
    role,
    status,
    lastActive: status === 'Invited' ? 'Never' : formatRelative(lastActiveDays, lastActiveHours),
    createdAt: formatDate(createdDaysAgo),
    projects: Math.floor(rand() * 12),
    twoFactor: rand() > 0.4,
  }
})

// --- Roles & permissions ---

export interface PermissionDef {
  key: string
  label: string
  description: string
  category: 'Prompts' | 'Characters' | 'Engines' | 'Projects' | 'Administration'
}

export const permissionDefs: PermissionDef[] = [
  { key: 'prompts.view', label: 'View prompts', description: 'Read prompt content and version history', category: 'Prompts' },
  { key: 'prompts.edit', label: 'Edit prompts', description: 'Create and modify prompts', category: 'Prompts' },
  { key: 'prompts.publish', label: 'Publish prompts', description: 'Promote prompts to live', category: 'Prompts' },
  { key: 'prompts.delete', label: 'Delete prompts', description: 'Permanently remove prompts', category: 'Prompts' },
  { key: 'characters.view', label: 'View characters', description: 'Read character profiles', category: 'Characters' },
  { key: 'characters.edit', label: 'Edit characters', description: 'Create and modify characters', category: 'Characters' },
  { key: 'characters.publish', label: 'Publish characters', description: 'Make characters live', category: 'Characters' },
  { key: 'engines.view', label: 'View AI engines', description: 'See connected provider configuration', category: 'Engines' },
  { key: 'engines.manage', label: 'Manage AI engines', description: 'Add, edit, or remove providers', category: 'Engines' },
  { key: 'projects.view', label: 'View projects', description: 'Access project workspaces', category: 'Projects' },
  { key: 'projects.manage', label: 'Manage projects', description: 'Create and configure projects', category: 'Projects' },
  { key: 'admin.users', label: 'Manage users', description: 'Invite, edit, and remove members', category: 'Administration' },
  { key: 'admin.roles', label: 'Manage roles', description: 'Create and edit custom roles', category: 'Administration' },
  { key: 'admin.billing', label: 'Manage billing', description: 'View and update billing details', category: 'Administration' },
  { key: 'admin.audit', label: 'View audit logs', description: 'Read the full audit trail', category: 'Administration' },
]

export interface RoleDef {
  key: UserRole | string
  name: string
  description: string
  builtIn: boolean
  memberCount: number
  permissions: string[]
}

export const roleDefs: RoleDef[] = [
  {
    key: 'Owner',
    name: 'Owner',
    description: 'Full access to every resource, billing, and workspace settings.',
    builtIn: true,
    memberCount: adminUsers.filter((u) => u.role === 'Owner').length,
    permissions: permissionDefs.map((p) => p.key),
  },
  {
    key: 'Admin',
    name: 'Admin',
    description: 'Manage users, roles, and platform configuration. No billing access.',
    builtIn: true,
    memberCount: adminUsers.filter((u) => u.role === 'Admin').length,
    permissions: permissionDefs.filter((p) => p.key !== 'admin.billing').map((p) => p.key),
  },
  {
    key: 'Editor',
    name: 'Editor',
    description: 'Create and publish prompts, characters, and projects.',
    builtIn: true,
    memberCount: adminUsers.filter((u) => u.role === 'Editor').length,
    permissions: permissionDefs.filter((p) => !p.key.startsWith('admin.')).map((p) => p.key),
  },
  {
    key: 'Member',
    name: 'Member',
    description: 'Create and edit content, without publish or delete rights.',
    builtIn: true,
    memberCount: adminUsers.filter((u) => u.role === 'Member').length,
    permissions: permissionDefs
      .filter((p) => p.key.endsWith('.view') || p.key.endsWith('.edit'))
      .map((p) => p.key),
  },
  {
    key: 'Viewer',
    name: 'Viewer',
    description: 'Read-only access across prompts, characters, and projects.',
    builtIn: true,
    memberCount: adminUsers.filter((u) => u.role === 'Viewer').length,
    permissions: permissionDefs.filter((p) => p.key.endsWith('.view')).map((p) => p.key),
  },
  {
    key: 'compliance-reviewer',
    name: 'Compliance Reviewer',
    description: 'Custom role — read access plus full audit log visibility.',
    builtIn: false,
    memberCount: 2,
    permissions: [...permissionDefs.filter((p) => p.key.endsWith('.view')).map((p) => p.key), 'admin.audit'],
  },
]

// --- AI providers ---

export interface AiProviderConfig {
  id: string
  name: string
  vendor: string
  status: 'Connected' | 'Attention needed' | 'Disconnected'
  models: string[]
  usagePercent: number
  monthlySpend: string
  keyLast4: string
  color: string
}

export const aiProviders: AiProviderConfig[] = [
  {
    id: 'anthropic',
    name: 'Anthropic',
    vendor: 'Claude family',
    status: 'Connected',
    models: ['Claude Opus 5', 'Claude Sonnet 5', 'Claude Haiku 4.5'],
    usagePercent: 48,
    monthlySpend: '$4,218',
    keyLast4: '7f2a',
    color: '#d97757',
  },
  {
    id: 'openai',
    name: 'OpenAI',
    vendor: 'GPT family',
    status: 'Connected',
    models: ['GPT-4o', 'GPT-4o mini', 'o3'],
    usagePercent: 24,
    monthlySpend: '$2,104',
    keyLast4: 'a91c',
    color: '#10a37f',
  },
  {
    id: 'google',
    name: 'Google',
    vendor: 'Gemini family',
    status: 'Connected',
    models: ['Gemini 2.5 Pro', 'Gemini 2.5 Flash'],
    usagePercent: 14,
    monthlySpend: '$1,032',
    keyLast4: '33be',
    color: '#4285f4',
  },
  {
    id: 'mistral',
    name: 'Mistral AI',
    vendor: 'Mistral family',
    status: 'Attention needed',
    models: ['Mistral Large', 'Mistral Small'],
    usagePercent: 9,
    monthlySpend: '$412',
    keyLast4: '10dd',
    color: '#fa520f',
  },
  {
    id: 'local',
    name: 'Local / self-hosted',
    vendor: 'On-premise cluster',
    status: 'Connected',
    models: ['Llama 3.3 70B'],
    usagePercent: 5,
    monthlySpend: '$0',
    keyLast4: '—',
    color: '#6b6577',
  },
]

// --- API Keys ---

export interface ApiKeyRecord {
  id: string
  name: string
  keyPrefix: string
  scope: 'Full access' | 'Read only' | 'Prompts only' | 'Engines only'
  createdAt: string
  lastUsed: string
  createdBy: string
  status: 'Active' | 'Revoked'
}

export const apiKeys: ApiKeyRecord[] = [
  { id: 'key_1', name: 'Production backend', keyPrefix: 'pip_live_7f2a', scope: 'Full access', createdAt: 'Jan 12, 2026', lastUsed: '2m ago', createdBy: 'Emerson Sterling', status: 'Active' },
  { id: 'key_2', name: 'Analytics pipeline', keyPrefix: 'pip_live_a91c', scope: 'Read only', createdAt: 'Feb 3, 2026', lastUsed: '1h ago', createdBy: 'Jordan Lee', status: 'Active' },
  { id: 'key_3', name: 'Animovia render worker', keyPrefix: 'pip_live_33be', scope: 'Engines only', createdAt: 'Mar 21, 2026', lastUsed: '18m ago', createdBy: 'Amara Chen', status: 'Active' },
  { id: 'key_4', name: 'CI test suite', keyPrefix: 'pip_test_10dd', scope: 'Prompts only', createdAt: 'Apr 9, 2026', lastUsed: '3d ago', createdBy: 'Priya Nair', status: 'Active' },
  { id: 'key_5', name: 'Legacy staging key', keyPrefix: 'pip_live_9c02', scope: 'Full access', createdAt: 'Nov 2, 2025', lastUsed: '4mo ago', createdBy: 'Emerson Sterling', status: 'Revoked' },
]

// --- Audit logs ---

export type AuditStatus = 'Success' | 'Failed' | 'Warning'

export interface AuditLogEntry {
  id: string
  user: string
  userEmail: string
  action: string
  resource: string
  resourceType: 'Prompt' | 'Character' | 'User' | 'API Key' | 'Engine' | 'Project' | 'System'
  timestamp: string
  timestampSort: number
  ip: string
  device: string
  status: AuditStatus
}

const actionsByType: Record<AuditLogEntry['resourceType'], string[]> = {
  Prompt: ['Created prompt', 'Updated prompt', 'Published prompt', 'Deleted prompt', 'Ran evaluation'],
  Character: ['Created character', 'Updated character', 'Published character'],
  User: ['Invited user', 'Updated role', 'Suspended user', 'Removed user', 'Reset password'],
  'API Key': ['Created API key', 'Revoked API key', 'Rotated API key'],
  Engine: ['Connected provider', 'Updated provider config', 'Disconnected provider'],
  Project: ['Created project', 'Archived project', 'Updated project settings'],
  System: ['Updated system settings', 'Created backup', 'Restored backup', 'Exported audit log'],
}

const devices = ['Chrome · macOS', 'Safari · iOS', 'Chrome · Windows', 'Firefox · Linux', 'Edge · Windows', 'API client']

export const auditLogs: AuditLogEntry[] = Array.from({ length: 86 }, (_, i) => {
  const rand = seededRandom(i + 500)
  const user = pick(adminUsers.slice(0, 15), rand)
  const resourceType = pick(Object.keys(actionsByType) as AuditLogEntry['resourceType'][], rand)
  const action = pick(actionsByType[resourceType], rand)
  const status: AuditStatus = rand() > 0.88 ? 'Failed' : rand() > 0.78 ? 'Warning' : 'Success'
  const daysAgo = Math.floor(rand() * 45)
  const hoursAgo = Math.floor(rand() * 24)
  const minutesAgo = Math.floor(rand() * 60)
  const sort = daysAgo * 1440 + hoursAgo * 60 + minutesAgo

  return {
    id: `log_${(i + 1).toString().padStart(4, '0')}`,
    user: user.name,
    userEmail: user.email,
    action,
    resource: `${resourceType.toLowerCase()}-${Math.floor(rand() * 900 + 100)}`,
    resourceType,
    timestamp: daysAgo === 0 ? formatRelative(0, hoursAgo || 1) : `${formatDate(daysAgo)}, ${String(hoursAgo).padStart(2, '0')}:${String(minutesAgo).padStart(2, '0')}`,
    timestampSort: sort,
    ip: `${Math.floor(rand() * 223 + 1)}.${Math.floor(rand() * 255)}.${Math.floor(rand() * 255)}.${Math.floor(rand() * 255)}`,
    device: pick(devices, rand),
    status,
  }
}).sort((a, b) => a.timestampSort - b.timestampSort)

// --- Backups ---

export interface BackupRecord {
  id: string
  label: string
  createdAt: string
  size: string
  type: 'Automatic' | 'Manual'
  status: 'Complete' | 'In progress' | 'Failed'
}

export const backups: BackupRecord[] = [
  { id: 'bk_1', label: 'Daily snapshot', createdAt: 'Aug 17, 2026, 03:00', size: '4.2 GB', type: 'Automatic', status: 'Complete' },
  { id: 'bk_2', label: 'Pre-migration snapshot', createdAt: 'Aug 16, 2026, 14:22', size: '4.1 GB', type: 'Manual', status: 'Complete' },
  { id: 'bk_3', label: 'Daily snapshot', createdAt: 'Aug 16, 2026, 03:00', size: '4.1 GB', type: 'Automatic', status: 'Complete' },
  { id: 'bk_4', label: 'Daily snapshot', createdAt: 'Aug 15, 2026, 03:00', size: '4.0 GB', type: 'Automatic', status: 'Complete' },
  { id: 'bk_5', label: 'Daily snapshot', createdAt: 'Aug 14, 2026, 03:00', size: '4.0 GB', type: 'Automatic', status: 'Failed' },
  { id: 'bk_6', label: 'Weekly archive', createdAt: 'Aug 10, 2026, 03:00', size: '3.9 GB', type: 'Automatic', status: 'Complete' },
]
