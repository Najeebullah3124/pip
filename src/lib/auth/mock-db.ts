/**
 * Local, browser-only stand-in for PIP's user directory. This exists purely
 * so the authentication UI has something real to validate against while the
 * backend is built. Every function here maps 1:1 to a future REST call —
 * see auth-client.ts for the seam where that swap happens.
 */
import type { AuthUser } from './types'

interface StoredUser {
  id: string
  name: string
  email: string
  password: string
  emailVerified: boolean
  onboarded: boolean
}

const USERS_KEY = 'pip.auth.users'
const RESET_TOKENS_KEY = 'pip.auth.resetTokens'
const VERIFY_TOKENS_KEY = 'pip.auth.verifyTokens'

function readUsers(): Record<string, StoredUser> {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) ?? '{}')
  } catch {
    return {}
  }
}

function writeUsers(users: Record<string, StoredUser>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function readTokenMap(key: string): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(key) ?? '{}')
  } catch {
    return {}
  }
}

function writeTokenMap(key: string, map: Record<string, string>) {
  localStorage.setItem(key, JSON.stringify(map))
}

function seed() {
  const users = readUsers()
  if (!users['demo@pip.ai']) {
    users['demo@pip.ai'] = {
      id: 'user_demo',
      name: 'Emerson Sterling',
      email: 'demo@pip.ai',
      password: 'demo1234',
      emailVerified: true,
      onboarded: true,
    }
    writeUsers(users)
  }
}
seed()

function toPublic(user: StoredUser): AuthUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    emailVerified: user.emailVerified,
    onboarded: user.onboarded,
  }
}

function genId() {
  return `user_${Math.random().toString(36).slice(2, 10)}`
}

function genToken() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}

export const mockDb = {
  findByEmail(email: string): StoredUser | null {
    return readUsers()[email.toLowerCase().trim()] ?? null
  },

  verifyPassword(email: string, password: string): StoredUser | null {
    const user = this.findByEmail(email)
    if (!user || user.password !== password) return null
    return user
  },

  createUser(input: { name: string; email: string; password: string }): StoredUser {
    const users = readUsers()
    const email = input.email.toLowerCase().trim()
    const user: StoredUser = {
      id: genId(),
      name: input.name.trim(),
      email,
      password: input.password,
      emailVerified: false,
      onboarded: false,
    }
    users[email] = user
    writeUsers(users)
    return user
  },

  setEmailVerified(email: string, verified: boolean) {
    const users = readUsers()
    const key = email.toLowerCase().trim()
    if (users[key]) {
      users[key].emailVerified = verified
      writeUsers(users)
    }
  },

  setOnboarded(email: string, onboarded: boolean) {
    const users = readUsers()
    const key = email.toLowerCase().trim()
    if (users[key]) {
      users[key].onboarded = onboarded
      writeUsers(users)
    }
  },

  setPassword(email: string, password: string) {
    const users = readUsers()
    const key = email.toLowerCase().trim()
    if (users[key]) {
      users[key].password = password
      writeUsers(users)
    }
  },

  createResetToken(email: string): string {
    const token = genToken()
    const map = readTokenMap(RESET_TOKENS_KEY)
    map[token] = email.toLowerCase().trim()
    writeTokenMap(RESET_TOKENS_KEY, map)
    return token
  },

  consumeResetToken(token: string): string | null {
    const map = readTokenMap(RESET_TOKENS_KEY)
    const email = map[token]
    if (!email) return null
    delete map[token]
    writeTokenMap(RESET_TOKENS_KEY, map)
    return email
  },

  peekResetToken(token: string): string | null {
    return readTokenMap(RESET_TOKENS_KEY)[token] ?? null
  },

  createVerifyToken(email: string): string {
    const token = genToken()
    const map = readTokenMap(VERIFY_TOKENS_KEY)
    map[token] = email.toLowerCase().trim()
    writeTokenMap(VERIFY_TOKENS_KEY, map)
    return token
  },

  consumeVerifyToken(token: string): string | null {
    const map = readTokenMap(VERIFY_TOKENS_KEY)
    const email = map[token]
    if (!email) return null
    delete map[token]
    writeTokenMap(VERIFY_TOKENS_KEY, map)
    return email
  },

  toPublic,
}

export type { StoredUser }
