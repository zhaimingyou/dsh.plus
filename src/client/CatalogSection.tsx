import { useEffect, useMemo, useState } from 'react'
import {
  CATEGORY_IDS,
  type CatalogEntry,
  type CatalogResponse,
  type CategoryId,
} from './types.ts'

interface Translate {
  (key: string): string
}

interface LocaleRef {
  getSnapshot(): { active: string }
}

type SortKey = 'stars-desc' | 'stars-asc' | 'updated-desc' | 'name-asc'

const CATEGORY_KEY: Record<CategoryId, string> = {
  agent: 'catAgent',
  tools: 'catTools',
  ui: 'catUi',
  workflow: 'catWorkflow',
  dev: 'catDev',
  misc: 'catMisc',
}

function hueOf(name: string): number {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) | 0
  return ((hash % 360) + 360) % 360
}

function formatStars(stars: number): string {
  if (stars >= 1000) return (stars / 1000).toFixed(1).replace(/\.0$/, '') + 'k'
  return String(stars)
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const area = document.createElement('textarea')
      area.value = text
      area.style.position = 'fixed'
      area.style.opacity = '0'
      document.body.appendChild(area)
      area.select()
      const ok = document.execCommand('copy')
      area.remove()
      return ok
    } catch {
      return false
    }
  }
}

function Cover({ name, url }: { name: string; url?: string }) {
  const [failed, setFailed] = useState(false)
  if (url === undefined || failed) {
    return (
      <span className="dsc-cover-fallback" style={{ background: `hsl(${hueOf(name)} 55% 48%)` }}>
        {name.charAt(0).toUpperCase()}
      </span>
    )
  }
  return (
    <img
      className="dsc-cover"
      src={url}
      alt=""
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  )
}

export function CatalogSection({ t, locale }: { t: Translate; locale: LocaleRef }) {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [entries, setEntries] = useState<CatalogEntry[]>([])
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string>('all')
  const [sort, setSort] = useState<SortKey>('stars-desc')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const lang = useMemo(() => {
    const active = (locale.getSnapshot().active || '').toLowerCase()
    return active.startsWith('en') ? 'en' : 'zh'
  }, [locale])

  useEffect(() => {
    let cancelled = false
    setStatus('loading')
    fetch(`/dsh.plus/catalog?locale=${lang}`)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        return response.json() as Promise<CatalogResponse>
      })
      .then((data) => {
        if (cancelled) return
        setEntries(Array.isArray(data.entries) ? data.entries : [])
        setStatus('ready')
      })
      .catch(() => {
        if (!cancelled) setStatus('error')
      })
    return () => {
      cancelled = true
    }
  }, [lang])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = entries.filter((entry) => {
      if (category !== 'all' && !entry.categories.includes(category)) return false
      if (q === '') return true
      const haystack = [entry.name, entry.summary, entry.publisher ?? '', ...entry.categories]
        .join('\u0000')
        .toLowerCase()
      return haystack.includes(q)
    })
    const sorted = [...list]
    switch (sort) {
      case 'stars-desc':
        sorted.sort((a, b) => b.stars - a.stars)
        break
      case 'stars-asc':
        sorted.sort((a, b) => a.stars - b.stars)
        break
      case 'updated-desc':
        sorted.sort((a, b) => (b.updatedAt ?? '').localeCompare(a.updatedAt ?? ''))
        break
      case 'name-asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name))
        break
    }
    return sorted
  }, [entries, query, category, sort])

  const copyInstall = (entry: CatalogEntry) => {
    void copyText(entry.install).then((ok) => {
      if (ok) {
        setCopiedId(entry.id)
        window.setTimeout(() => setCopiedId((current) => (current === entry.id ? null : current)), 1600)
      }
    })
  }

  const formatDate = (iso?: string) => {
    if (!iso) return ''
    const date = new Date(iso)
    if (Number.isNaN(date.getTime())) return ''
    return date.toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="dsc-root">
      <header className="dsc-header">
        <h2>{t('title')}</h2>
        <p>{t('subtitle')}</p>
      </header>

      <div className="dsc-toolbar">
        <input
          className="dsc-search"
          type="search"
          value={query}
          placeholder={t('searchPh')}
          onChange={(event) => setQuery(event.currentTarget.value)}
        />
        <select
          className="dsc-sort"
          aria-label={t('sortLabel')}
          value={sort}
          onChange={(event) => setSort(event.currentTarget.value as SortKey)}
        >
          <option value="stars-desc">{t('sortStarsDesc')}</option>
          <option value="stars-asc">{t('sortStarsAsc')}</option>
          <option value="updated-desc">{t('sortUpdated')}</option>
          <option value="name-asc">{t('sortName')}</option>
        </select>
      </div>

      <div className="dsc-chips">
        <button
          type="button"
          className="dsc-chip"
          data-active={category === 'all'}
          onClick={() => setCategory('all')}
        >
          {t('all')}
        </button>
        {CATEGORY_IDS.map((id) => (
          <button
            key={id}
            type="button"
            className="dsc-chip"
            data-active={category === id}
            onClick={() => setCategory(category === id ? 'all' : id)}
          >
            {t(CATEGORY_KEY[id])}
          </button>
        ))}
      </div>

      {status === 'loading' && (
        <div className="dsc-state">
          <span className="dsc-spin" aria-hidden="true" />
          {t('loading')}
        </div>
      )}

      {status === 'error' && (
        <div className="dsc-state dsc-error">
          <div>{t('loadFail')}</div>
          <button
            type="button"
            className="dsc-btn dsc-btn-primary"
            onClick={() => {
              setStatus('loading')
              setCategory('all')
              fetch(`/dsh.plus/catalog?locale=${lang}`)
                .then((r) => (r.ok ? r.json() as Promise<CatalogResponse> : Promise.reject(new Error())))
                .then((d) => {
                  setEntries(Array.isArray(d.entries) ? d.entries : [])
                  setStatus('ready')
                })
                .catch(() => setStatus('error'))
            }}
          >
            {t('retry')}
          </button>
        </div>
      )}

      {status === 'ready' && visible.length === 0 && (
        <div className="dsc-state">{t('empty')}</div>
      )}

      {status === 'ready' && visible.length > 0 && (
        <>
          <div className="dsc-count">{visible.length} {t('many')}</div>
          <div className="dsc-grid">
            {visible.map((entry) => (
              <article key={entry.id} className="dsc-card">
                <div className="dsc-card-head">
                  <Cover name={entry.name} url={entry.cover} />
                  <div className="dsc-card-body">
                    <h3 className="dsc-name">
                      <a href={entry.repository} target="_blank" rel="noopener noreferrer">
                        {entry.name}
                      </a>
                    </h3>
                    <p className="dsc-summary">{entry.summary}</p>
                  </div>
                </div>

                {entry.categories.length > 0 && (
                  <div className="dsc-tags">
                    {entry.categories.map((id) => (
                      <span key={id} className="dsc-tag">
                        {CATEGORY_IDS.includes(id as CategoryId) ? t(CATEGORY_KEY[id as CategoryId]) : id}
                      </span>
                    ))}
                  </div>
                )}

                <div className="dsc-meta">
                  <span className="dsc-stars">⭐ {formatStars(entry.stars)}</span>
                  {entry.license && <span>{entry.license}</span>}
                  {entry.publisher && (
                    <span>
                      {t('publishedBy')} {entry.publisher}
                    </span>
                  )}
                  {entry.updatedAt && (
                    <span>
                      {t('updatedAt')} {formatDate(entry.updatedAt)}
                    </span>
                  )}
                </div>

                {entry.install && (
                  <div className="dsc-actions">
                    <div className="dsc-install">
                      <code title={entry.install}>{entry.install}</code>
                      <button type="button" className="dsc-btn dsc-btn-primary" onClick={() => copyInstall(entry)}>
                        {copiedId === entry.id ? t('copied') : t('copy')}
                      </button>
                    </div>
                    <div className="dsc-actions-row">
                      <a className="dsc-btn dsc-btn-primary" href={entry.repository} target="_blank" rel="noopener noreferrer">
                        {t('github')} ↗
                      </a>
                      <span className="dsc-install-hint">{t('installHint')}</span>
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
