// ─────────────────────────────────────────────────────────────────────────────
// Host half: live catalog loader.
//
// Fetches the dsh.plus community catalog over the SAME public v1 contract the
// Community Market consumes (Path A), merges star counts from the site's
// /plugin-index.json, and derives a copyable install command from the
// normalized GitHub repository. Remote data is treated as untrusted: every
// field is sanitized and every URL re-validated before it reaches the client.
// ─────────────────────────────────────────────────────────────────────────────

export type CatalogLocale = 'zh' | 'en'

export interface CatalogEntry {
  id: string
  name: string
  summary: string
  description?: string
  categories: string[]
  repository: string
  homepage?: string
  publisher?: string
  license?: string
  updatedAt?: string
  stars: number
  cover?: string
  install: string
}

const CATALOG_ORIGIN = 'https://dsh.plus'
const REQUEST_TIMEOUT_MS = 9000
const MAX_PAGES = 10

// The contract forbids control characters and Bidi-masking chars in catalog
// data; clamp defensively because the source is remote and untrusted.
const CONTROL_CHARS = /[\u0000-\u001F\u007F-\u009F\u202A-\u202E\u2066-\u2069]/g
// https URL with no embedded credentials and no fragment.
const HTTPS_URL_RE = /^https:\/\/(?![^/?#]*@)(?![^/?#]*:)[^#]+$/
const CATEGORY_ID_RE = /^[a-z0-9][a-z0-9._:-]*$/

async function fetchJson(url: string): Promise<unknown> {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    headers: { accept: 'application/json' },
  })
  if (!response.ok) {
    throw new Error(`dsh.plus responded HTTP ${response.status} for ${url}`)
  }
  return (await response.json()) as unknown
}

function safeString(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') return ''
  return value.replace(CONTROL_CHARS, '').trim().slice(0, maxLength)
}

function safeUrl(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  return HTTPS_URL_RE.test(trimmed) ? trimmed : undefined
}

/** `dsh plugin --profile web add github:<owner>/<repo>` from a GitHub URL. */
function deriveInstall(repositoryUrl: string): string {
  const match = /^https:\/\/github\.com\/([^/]+)\/([^/#?]+)/i.exec(repositoryUrl)
  if (match === null) return ''
  const repo = match[2].replace(/\.git$/i, '')
  return `dsh plugin --profile web add github:${match[1]}/${repo}`
}

async function loadStars(): Promise<Map<string, number>> {
  const map = new Map<string, number>()
  try {
    const rows = (await fetchJson(`${CATALOG_ORIGIN}/plugin-index.json`)) as Array<{
      slug?: unknown
      stars?: unknown
    }>
    if (!Array.isArray(rows)) return map
    for (const row of rows) {
      if (row === null || typeof row !== 'object') continue
      const slug = safeString(row.slug, 120)
      const stars = row.stars
      if (slug && typeof stars === 'number' && Number.isFinite(stars)) map.set(slug, stars)
    }
  } catch (cause) {
    // Stars are a nice-to-have; a failed stats fetch must not blank the catalog.
    console.error('[dsh.plus] failed to load star counts:', cause)
  }
  return map
}

async function loadProviderItems(locale: CatalogLocale): Promise<unknown[]> {
  const items: unknown[] = []
  let cursor: string | undefined
  for (let page = 0; page < MAX_PAGES; page++) {
    const params = new URLSearchParams({ locale, limit: '100' })
    if (cursor !== undefined) params.set('cursor', cursor)
    const payload = (await fetchJson(`${CATALOG_ORIGIN}/v1/plugins?${params.toString()}`)) as {
      items?: unknown
      page?: { nextCursor?: unknown }
    }
    const batch = payload.items
    if (Array.isArray(batch)) items.push(...batch)
    cursor = typeof payload.page?.nextCursor === 'string' ? payload.page.nextCursor : undefined
    if (cursor === undefined) break
  }
  return items
}

function toEntry(raw: unknown, stars: Map<string, number>): CatalogEntry | null {
  if (raw === null || typeof raw !== 'object') return null
  const item = raw as Record<string, unknown>

  const repository = safeUrl((item.repository as { url?: unknown } | undefined)?.url)
  const id = safeString(item.id, 120)
  const name = safeString((item.displayName as string) ?? item.name, 120)
  const summary = safeString(item.summary, 300)
  if (!repository || !id || !name || !summary) return null

  const categories = Array.isArray(item.categories)
    ? (item.categories as unknown[])
        .filter((c): c is string => typeof c === 'string' && CATEGORY_ID_RE.test(c))
        .slice(0, 8)
    : []

  const description = safeString(item.description, 4000)
  const cover = safeUrl((item.media as { icon?: { url?: unknown } } | undefined)?.icon?.url)

  const starCount = stars.get(id) ?? 0

  return {
    id,
    name,
    summary,
    description: description || undefined,
    categories,
    repository,
    homepage: safeUrl(item.homepage),
    publisher: safeString((item.publisher as { name?: unknown } | undefined)?.name, 120) || undefined,
    license: safeString(item.license, 80) || undefined,
    updatedAt: typeof item.updatedAt === 'string' ? item.updatedAt : undefined,
    stars: Number.isFinite(starCount) ? starCount : 0,
    cover,
    install: deriveInstall(repository),
  }
}

/**
 * Load the full merged catalog for one locale. Throws when the provider page
 * cannot be fetched so the route can answer 502 and the client can offer an
 * explicit retry. Star-enrichment failures are swallowed inside loadStars().
 */
export async function loadCatalog(locale: CatalogLocale): Promise<CatalogEntry[]> {
  const [stars, items] = await Promise.all([loadStars(), loadProviderItems(locale)])
  const entries: CatalogEntry[] = []
  const seen = new Set<string>()
  for (const raw of items) {
    const entry = toEntry(raw, stars)
    if (entry === null || seen.has(entry.id)) continue
    seen.add(entry.id)
    entries.push(entry)
  }
  return entries
}
