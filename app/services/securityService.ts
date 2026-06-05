import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest, NextResponse } from "next/server";

import { createRefreshToken, createTokenId, hashToken, signAccessToken, verifyAccessToken } from "@/lib/security/jwt";
import { hashPassword, verifyPassword } from "@/lib/security/password";
import { hasPermission, permissionKeys, rolePermissionMap, roles } from "@/lib/security/rbac";

import { securityRepository } from "../repositories/securityRepository";

export const accessTokenCookie = "zoiko_access_token";
export const refreshTokenCookie = "zoiko_refresh_token";

export type SecurityContext = {
  tenantId: string;
  userId: string;
  sessionId: string;
  roles: string[];
  permissions: string[];
};

export class AuthorizationError extends Error {
  constructor(
    message: string,
    public status = 403,
  ) {
    super(message);
  }
}

function getRequestIp(request: NextRequest) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? request.headers.get("x-real-ip") ?? undefined;
}

function getRequestUserAgent(request: NextRequest) {
  return request.headers.get("user-agent") ?? undefined;
}

function collectGrants(user: {
  roles: { role: { key: string; permissions: { permission: { key: string } }[] } }[];
  permissions: { permission: { key: string } }[];
}) {
  const directPermissions = user.permissions.map((grant) => grant.permission.key);
  const rolePermissions = user.roles.flatMap((grant) => grant.role.permissions.map((item) => item.permission.key));

  return {
    roles: user.roles.map((grant) => grant.role.key),
    permissions: Array.from(new Set([...directPermissions, ...rolePermissions])),
  };
}

function applyAuthCookies(response: NextResponse, accessToken: string, refreshToken: string, refreshExpiresAt: Date) {
  response.cookies.set(accessTokenCookie, accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 15 * 60,
  });
  response.cookies.set(refreshTokenCookie, refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: refreshExpiresAt,
  });
}

export function clearAuthCookies(response: NextResponse) {
  response.cookies.delete(accessTokenCookie);
  response.cookies.delete(refreshTokenCookie);
}

export async function login(input: { tenantSlug: string; email: string; password: string; request: NextRequest }) {
  const tenant = await securityRepository.findTenantBySlug(input.tenantSlug);
  if (!tenant || tenant.status !== "ACTIVE") {
    throw new AuthorizationError("Invalid tenant or credentials.", 401);
  }

  const user = await securityRepository.findUserForLogin(tenant.id, input.email.toLowerCase());
  const isValidPassword = user ? await verifyPassword(input.password, user.passwordHash) : false;

  if (!user || !user.isActive || !isValidPassword) {
    await securityRepository.writeAudit({
      tenantId: tenant.id,
      action: "Login failed",
      eventType: "LOGIN",
      category: "AUTHENTICATION",
      outcome: "FAILURE",
      resourceType: "User",
      resourceName: input.email,
      ipAddress: getRequestIp(input.request),
      userAgent: getRequestUserAgent(input.request),
    });
    throw new AuthorizationError("Invalid tenant or credentials.", 401);
  }

  const grants = collectGrants(user);
  const refreshToken = createRefreshToken();
  const accessTokenId = createTokenId();
  const refreshExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
  const session = await securityRepository.createSession({
    tenantId: tenant.id,
    userId: user.id,
    accessTokenId,
    refreshTokenHash: hashToken(refreshToken),
    expiresAt: refreshExpiresAt,
    ipAddress: getRequestIp(input.request),
    userAgent: getRequestUserAgent(input.request),
  });
  const accessToken = signAccessToken({
    sub: user.id,
    tenantId: tenant.id,
    sessionId: session.id,
    jti: accessTokenId,
    roles: grants.roles,
    permissions: grants.permissions,
  });

  await securityRepository.writeAudit({
    tenantId: tenant.id,
    userId: user.id,
    action: "Login succeeded",
    eventType: "LOGIN",
    category: "AUTHENTICATION",
    outcome: "SUCCESS",
    resourceType: "Session",
    resourceId: session.id,
    resourceName: user.email,
    ipAddress: getRequestIp(input.request),
    userAgent: getRequestUserAgent(input.request),
  });

  return { accessToken, refreshToken, refreshExpiresAt };
}

export async function logout(request: NextRequest) {
  const token = request.cookies.get(accessTokenCookie)?.value;
  const payload = verifyAccessToken(token);

  if (payload?.sessionId) {
    await securityRepository.revokeSession(payload.sessionId).catch(() => null);
    await securityRepository.writeAudit({
      tenantId: payload.tenantId,
      userId: payload.sub,
      action: "Logout completed",
      eventType: "LOGOUT",
      category: "AUTHENTICATION",
      outcome: "SUCCESS",
      resourceType: "Session",
      resourceId: payload.sessionId,
      ipAddress: getRequestIp(request),
      userAgent: getRequestUserAgent(request),
    });
  }
}

export async function refreshSession(request: NextRequest) {
  const refreshToken = request.cookies.get(refreshTokenCookie)?.value;
  if (!refreshToken) {
    throw new AuthorizationError("Refresh token is missing.", 401);
  }

  const session = await securityRepository.findSessionByRefreshHash(hashToken(refreshToken));
  if (!session || !session.user.isActive || session.user.tenant.status !== "ACTIVE") {
    throw new AuthorizationError("Refresh token is invalid.", 401);
  }

  const grants = collectGrants(session.user);
  const nextRefreshToken = createRefreshToken();
  const nextAccessTokenId = createTokenId();
  const refreshExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

  await securityRepository.rotateSession(session.id, nextAccessTokenId, hashToken(nextRefreshToken), refreshExpiresAt);

  const accessToken = signAccessToken({
    sub: session.userId,
    tenantId: session.tenantId,
    sessionId: session.id,
    jti: nextAccessTokenId,
    roles: grants.roles,
    permissions: grants.permissions,
  });

  return { accessToken, refreshToken: nextRefreshToken, refreshExpiresAt };
}

export function setLoginCookies(response: NextResponse, tokens: { accessToken: string; refreshToken: string; refreshExpiresAt: Date }) {
  applyAuthCookies(response, tokens.accessToken, tokens.refreshToken, tokens.refreshExpiresAt);
}

export async function getCurrentSecurityContext(): Promise<SecurityContext | null> {
  const cookieStore = await cookies();
  const payload = verifyAccessToken(cookieStore.get(accessTokenCookie)?.value);

  if (!payload) {
    return null;
  }

  const session = await securityRepository.findSession(payload.sessionId);
  if (!session || session.revokedAt || session.expiresAt <= new Date() || session.accessTokenId !== payload.jti || !session.user.isActive) {
    return null;
  }

  const grants = collectGrants(session.user);

  return {
    tenantId: session.tenantId,
    userId: session.userId,
    sessionId: session.id,
    roles: grants.roles,
    permissions: grants.permissions,
  };
}

export async function requirePermission(permission: string) {
  const context = await getCurrentSecurityContext();

  if (!context) {
    throw new AuthorizationError("Authentication is required.", 401);
  }

  if (!hasPermission(context.permissions, permission)) {
    await securityRepository.writeAudit({
      tenantId: context.tenantId,
      userId: context.userId,
      action: `Authorization denied for ${permission}`,
      eventType: "SECURITY_EVENT",
      category: "AUTHORIZATION",
      outcome: "DENIED",
      resourceType: "Permission",
      resourceName: permission,
    });
    throw new AuthorizationError("You are not authorized to access this Zoiko One resource.", 403);
  }

  return context;
}

export async function requirePagePermission(permission: string) {
  try {
    return await requirePermission(permission);
  } catch (error) {
    if (error instanceof AuthorizationError && error.status === 401) {
      redirect("/login");
    }

    throw error;
  }
}

export async function assignRole(input: { targetUserId: string; roleKey: string }) {
  const context = await requirePermission("users.*");
  const role = await securityRepository.findRoleByKey(context.tenantId, input.roleKey);

  if (!role) {
    throw new AuthorizationError("Role does not exist for this tenant.", 404);
  }

  const assignment = await securityRepository.assignRole(input.targetUserId, role.id, context.tenantId, context.userId);
  await securityRepository.writeAudit({
    tenantId: context.tenantId,
    userId: context.userId,
    action: `Assigned role ${input.roleKey}`,
    eventType: "USER_CHANGE",
    category: "AUTHORIZATION",
    outcome: "SUCCESS",
    resourceType: "UserRole",
    resourceId: input.targetUserId,
    resourceName: input.roleKey,
  });

  return assignment;
}

export async function assignPermission(input: { targetUserId: string; permissionKey: string }) {
  const context = await requirePermission("users.*");
  const permission = await securityRepository.findPermissionByKey(context.tenantId, input.permissionKey);

  if (!permission) {
    throw new AuthorizationError("Permission does not exist for this tenant.", 404);
  }

  const assignment = await securityRepository.assignPermission(input.targetUserId, permission.id, context.tenantId, context.userId);
  await securityRepository.writeAudit({
    tenantId: context.tenantId,
    userId: context.userId,
    action: `Assigned permission ${input.permissionKey}`,
    eventType: "USER_CHANGE",
    category: "AUTHORIZATION",
    outcome: "SUCCESS",
    resourceType: "UserPermission",
    resourceId: input.targetUserId,
    resourceName: input.permissionKey,
  });

  return assignment;
}

export async function getPasswordHashForSeed(password: string) {
  return hashPassword(password);
}

export function getSecurityBaseline() {
  return {
    roles,
    permissionKeys,
    rolePermissionMap,
  };
}
