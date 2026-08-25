import { loadCatalog } from "./catalog.js";
import { sendJson } from "./http.js";
export const CATALOG_ROUTE = '/dsh.plus/catalog';
/**
 * Register the catalog route. Read-only GET; returns the merged, sanitized
 * catalog for the requested locale or 502 with { ok: false } when dsh.plus is
 * unreachable so the browser UI can render a retry state instead of a blank.
 */
export function mountCatalogRoutes(host) {
    return host.webServer.register({
        kind: 'exact',
        path: CATALOG_ROUTE,
        handler: async (request, response) => {
            if (request.method !== 'GET') {
                sendJson(response, 405, { ok: false, error: 'method not allowed' });
                return;
            }
            const url = new URL(request.url ?? '/', 'http://localhost');
            const locale = url.searchParams.get('locale') === 'en' ? 'en' : 'zh';
            try {
                const entries = await loadCatalog(locale);
                sendJson(response, 200, { ok: true, generatedAt: new Date().toISOString(), entries });
            }
            catch (cause) {
                const message = cause instanceof Error ? cause.message : String(cause);
                host.logger?.warn(`[dsh.plus] ${message}`);
                sendJson(response, 502, { ok: false, error: 'catalog unavailable' });
            }
        },
    });
}
