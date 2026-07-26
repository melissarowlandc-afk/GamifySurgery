import type { IncomingMessage, ServerResponse } from "node:http";

export type AuthorityPolicy = {
  expectedHost: string;
  allowedOrigin: string;
  requireOrigin: boolean;
};

export class RequestSecurityError extends Error {
  constructor(
    readonly statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = "RequestSecurityError";
  }
}

function singleHeader(
  value: string | string[] | undefined,
): string | undefined {
  return Array.isArray(value) ? undefined : value;
}

export function assertRequestAuthority(
  request: IncomingMessage,
  policy: AuthorityPolicy,
): void {
  const host = singleHeader(request.headers.host);
  if (host !== policy.expectedHost) {
    throw new RequestSecurityError(403, "Unexpected request host.");
  }
  const origin = singleHeader(request.headers.origin);
  if (origin !== undefined && origin !== policy.allowedOrigin) {
    throw new RequestSecurityError(403, "Unexpected request origin.");
  }
  const fetchSite = singleHeader(request.headers["sec-fetch-site"]);
  if (
    fetchSite !== undefined &&
    fetchSite !== "same-origin" &&
    fetchSite !== "none"
  ) {
    throw new RequestSecurityError(
      403,
      "Cross-site browser requests are not permitted.",
    );
  }
  if (policy.requireOrigin && origin !== policy.allowedOrigin) {
    throw new RequestSecurityError(
      403,
      "A same-origin request is required for this operation.",
    );
  }
}

export function applySecurityHeaders(response: ServerResponse): void {
  response.setHeader("Cache-Control", "no-store");
  response.setHeader(
    "Content-Security-Policy",
    "default-src 'none'; frame-ancestors 'none'",
  );
  response.setHeader("Referrer-Policy", "no-referrer");
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("X-Frame-Options", "DENY");
}

export function sendJson(
  response: ServerResponse,
  statusCode: number,
  value: unknown,
): void {
  applySecurityHeaders(response);
  const body = JSON.stringify(value);
  response.statusCode = statusCode;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("Content-Length", Buffer.byteLength(body));
  response.end(body);
}
