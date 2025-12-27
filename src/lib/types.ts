export interface MockEndpoint {
  id: string;
  name: string;
  path: string;
  groupId?: string;
  responseData: unknown;
  contentType: string;
  statusCode: number;
  enabled: boolean;
  delayMs: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMockEndpointDto {
  name: string;
  path: string;
  groupId?: string;
  responseData: unknown;
  contentType?: string;
  statusCode?: number;
  enabled?: boolean;
  delayMs?: number;
}

export interface UpdateMockEndpointDto {
  name?: string;
  path?: string;
  groupId?: string;
  responseData?: unknown;
  contentType?: string;
  statusCode?: number;
  enabled?: boolean;
  delayMs?: number;
}

export interface ApiStats {
  total: number;
  enabled: number;
  disabled: number;
  maxEndpoints: number;
  remainingSlots: number;
}

// Auth types
export type UserStatus = "enabled" | "blocked";
export type UserRole = "admin" | "user";

export interface PublicUser {
  id: string;
  name: string;
  email?: string;
  status: UserStatus;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: PublicUser;
}

export interface LoginPayload {
  name: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  password: string;
}

// User management types
export interface CreateUserDto {
  name: string;
  password: string;
  email?: string;
  status?: UserStatus;
  role?: UserRole;
}

export interface UpdateUserDto {
  name?: string;
  password?: string;
  email?: string;
  status?: UserStatus;
  role?: UserRole;
}

// Proxy endpoint types
export interface ProxyEndpoint {
  id: string;
  name: string;
  path: string;
  baseUrl?: string;
  groupId?: string;
  enabled: boolean;
  useCache: boolean;
  statusCodeOverride?: number;
  delayMs: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProxyEndpointDto {
  name: string;
  path: string;
  baseUrl?: string;
  groupId?: string;
  enabled?: boolean;
  useCache?: boolean;
  statusCodeOverride?: number;
  delayMs?: number;
}

export interface UpdateProxyEndpointDto {
  name?: string;
  path?: string;
  baseUrl?: string;
  groupId?: string;
  enabled?: boolean;
  useCache?: boolean;
  statusCodeOverride?: number;
  delayMs?: number;
}

export interface ProxyStats {
  total: number;
  enabled: number;
  disabled: number;
  maxEndpoints: number;
  remaining: number;
}
