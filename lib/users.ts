// not at all secure, but it's just a demo

export const users: Record<string, string> = {
  user: 'pass',
}

export const tokens: Record<string, string> = {}

export function generateToken(user: string) {
  const token = Math.random().toString(36).slice(2)
  tokens[token] = user
  return token
}