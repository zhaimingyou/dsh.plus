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

export interface CatalogResponse {
  ok: boolean
  generatedAt?: string
  entries?: CatalogEntry[]
  error?: string
}

export const CATEGORY_IDS = ['agent', 'tools', 'ui', 'workflow', 'dev', 'misc'] as const
export type CategoryId = (typeof CATEGORY_IDS)[number]
