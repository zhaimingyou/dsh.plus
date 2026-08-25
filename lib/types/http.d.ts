import type { ServerResponse } from 'node:http';
/** Write a JSON payload. The catalog route is read-only and re-fetched from
 * dsh.plus on every request, so responses are never cached. */
export declare function sendJson(response: ServerResponse, status: number, payload: unknown): void;
