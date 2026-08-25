import type { ServerResponse } from 'node:http'

/** Write a JSON payload. The catalog route is read-only and re-fetched from
 * dsh.plus on every request, so responses are never cached. */
export function sendJson(response: ServerResponse, status: number, payload: unknown): void {
  const body = JSON.stringify(payload)
  response.writeHead(status, {
    'cache-control': 'no-store',
    'content-type': 'application/json; charset=utf-8',
    'content-length': Buffer.byteLength(body),
  })
  response.end(body)
}
