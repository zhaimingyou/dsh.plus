import { createElement as h } from 'react'
import { CatalogSection } from './CatalogSection.tsx'
import { en, zh } from './locales.ts'
import { installStyles } from './styles.ts'

const NS = 'dsh.plus'

/** The subset of the locale service this plugin touches. */
interface LocaleService {
  register(namespace: string, dicts: { zh: Record<string, string>; en: Record<string, string> }): unknown
  bind(namespace: string): (key: string, ...args: Array<string | number>) => string
  getSnapshot(): { active: string }
}

/** The subset of the slots service this plugin touches. */
interface SlotsService {
  inject(slot: string, register: () => unknown): void
  register(meta: Record<string, unknown>, component: () => unknown): unknown
}

/** The client Cordis context shape this plugin relies on (structural). */
interface CatalogClientContext {
  effect(callback: () => unknown, label?: string): void
  locale: LocaleService
  slots: SlotsService
}

export const name = 'dsh.plus'
export const inject = ['slots', 'locale']

/**
 * Client entry: register the "dsh.plus" section in the Settings
 * shell so the gallery renders as a first-class page. Built by tsdown into
 * the __ModuleLoader__ factory bundle at client/client.js.
 */
export function apply(ctx: CatalogClientContext): void {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'dsh.plus: dictionaries')
  ctx.effect(() => installStyles(), 'dsh.plus: styles')

  const t = ctx.locale.bind(NS)

  ctx.slots.inject('settings.section', () =>
    ctx.slots.register(
      {
        name: 'settings.section',
        id: 'dsh.plus',
        order: 50,
        label: () => t('nav'),
        locale: NS,
        inject: () => ({ t }),
      },
      () => h(CatalogSection, { t, locale: ctx.locale }),
    ),
  )
}
