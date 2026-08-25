import type { IncomingMessage, ServerResponse } from 'node:http';
/** Structural subset of DSH's web-server service this plugin needs. */
export interface WebServerService {
    register(route: {
        kind: 'exact' | 'prefix';
        path: string;
        handler: (request: IncomingMessage, response: ServerResponse) => void | Promise<void>;
    }): () => void;
}
export interface CatalogHost {
    webServer: WebServerService;
    logger?: {
        warn(message: string): void;
    };
}
export declare const CATALOG_ROUTE = "/dsh.plus/catalog";
/**
 * Register the catalog route. Read-only GET; returns the merged, sanitized
 * catalog for the requested locale or 502 with { ok: false } when dsh.plus is
 * unreachable so the browser UI can render a retry state instead of a blank.
 */
export declare function mountCatalogRoutes(host: CatalogHost): () => void;
