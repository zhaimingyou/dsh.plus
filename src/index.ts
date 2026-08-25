import type { Context } from '@deepseek-ai/cordis'
import { mountCatalogRoutes, type CatalogHost } from './routes.ts'

export const name = 'dsh-plus-catalog'

/** The scoped context the webServer injection hands to the callback. */
interface ScopedHost extends CatalogHost {
  effect(callback: () => (() => void | Promise<void>), label: string): void
}

/**
 * Host entry: mount the catalog HTTP route once the web-server service is
 * available. This is the only host-side contribution — the plugin is a
 * read-only gallery; it installs nothing and mutates nothing.
 */
export function apply(ctx: Context): void {
  ctx.inject(['webServer'], (hostCtx: Context) => {
    const host = hostCtx as unknown as ScopedHost
    host.effect(() => mountCatalogRoutes(host), 'dsh-plus-catalog: http routes')
  })
}
