import { mountCatalogRoutes } from "./routes.js";
export const name = 'dsh.plus';
/**
 * Host entry: mount the catalog HTTP route once the web-server service is
 * available. This is the only host-side contribution — the plugin is a
 * read-only gallery; it installs nothing and mutates nothing.
 */
export function apply(ctx) {
    ctx.inject(['webServer'], (hostCtx) => {
        const host = hostCtx;
        host.effect(() => mountCatalogRoutes(host), 'dsh.plus: http routes');
    });
}
