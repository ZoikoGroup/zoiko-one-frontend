import { createHmac, randomBytes, timingSafeEqual } from "crypto";

export type AccessTokenPayload = {
  sub: string;
  tenantId: string;
  sessionId: string;
  jti: string;
  roles: string[];
  permissions: string[];
  exp: number;
  iat: number;
};

const encoder = new TextEncoder();

function base64UrlEncode(value: string | Buffer) {
  return Buffer.from(value).toString("base64url");
}

function base64UrlDecode(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function getJwtSecret() {
  const secret = process.env.JWT_SECRET ?? process.env.SESSION_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET must be set to at least 32 characters for Zoiko One authentication.");
  }

  return secret;
}

function signContent(content: string) {
  return createHmac("sha256", getJwtSecret()).update(content).digest("base64url");
}

export function createTokenId() {
  return randomBytes(24).toString("base64url");
}

export function createRefreshToken() {
  return randomBytes(48).toString("base64url");
}

export function hashToken(token: string) {
  return createHmac("sha256", getJwtSecret()).update(token).digest("base64url");
}

export function signAccessToken(payload: Omit<AccessTokenPayload, "iat" | "exp">, ttlSeconds = 900) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = base64UrlEncode(JSON.stringify({ ...payload, iat: now, exp: now + ttlSeconds }));
  const content = `${header}.${body}`;

  return `${content}.${signContent(content)}`;
}

export function verifyAccessToken(token?: string): AccessTokenPayload | null {
  if (!token) {
    return null;
  }

  const [header, body, signature] = token.split(".");
  if (!header || !body || !signature) {
    return null;
  }

  const content = `${header}.${body}`;
  const expectedSignature = signContent(content);
  const provided = encoder.encode(signature);
  const expected = encoder.encode(expectedSignature);

  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) {
    return null;
  }

  const payload = JSON.parse(base64UrlDecode(body)) as AccessTokenPayload;

  if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
    return null;
  }

  return payload;
}
