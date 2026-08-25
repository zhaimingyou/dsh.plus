/** Write a JSON payload. The catalog route is read-only and re-fetched from
 * dsh.plus on every request, so responses are never cached. */
export function sendJson(response, status, payload) {
    const body = JSON.stringify(payload);
    response.writeHead(status, {
        'cache-control': 'no-store',
        'content-type': 'application/json; charset=utf-8',
        'content-length': Buffer.byteLength(body),
    });
    response.end(body);
}
