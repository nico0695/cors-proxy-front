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
export type UserStatus = 'enabled' | 'blocked';
export type UserRole = 'admin' | 'user';

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

// Custom CRUD types
export type CrudFieldType = 'string' | 'number' | 'boolean' | 'date';

export interface CrudFieldDefinition {
  name: string;
  type: CrudFieldType;
  required: boolean;
}

export interface CrudTable {
  id: string;
  name: string;
  basePath: string;
  schema: CrudFieldDefinition[];
  maxEntries: number;
  ownerUserId: string;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCrudTableDto {
  name: string;
  basePath: string;
  schema: CrudFieldDefinition[];
  maxEntries?: number;
  enabled?: boolean;
}

export interface UpdateCrudTableDto {
  name?: string;
  basePath?: string;
  schema?: CrudFieldDefinition[];
  maxEntries?: number;
  enabled?: boolean;
}

export interface CrudStats {
  total: number;
  enabled: number;
  disabled: number;
  maxTables: number | null;
  remaining: number | null;
}

export type CrudEntry = {
  id: string;
  createdAt: string;
  updatedAt: string;
} & Record<string, unknown>;

export type CreateCrudEntryDto = Record<string, unknown>;
export type UpdateCrudEntryDto = Record<string, unknown>;
