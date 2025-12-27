import { z } from "zod";

// Maximum delay: 1 minute (60000ms) to prevent blocking backend
export const MAX_DELAY_MS = 60000;

// Maximum delay for proxy: 10 seconds (10000ms)
export const MAX_PROXY_DELAY_MS = 10000;

export const createEndpointSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  path: z
    .string()
    .min(1, "Path is required")
    .regex(/^\//, "Path must start with /"),
  groupId: z.string().optional(),
  responseData: z.string().min(1, "Response data is required"),
  contentType: z.enum([
    "application/json",
    "application/xml",
    "text/plain",
    "text/html",
  ]),
  statusCode: z.number().int().min(100).max(599),
  enabled: z.boolean().default(true),
  delayMs: z.number().int().min(0).max(MAX_DELAY_MS).default(0),
});

export const updateEndpointSchema = createEndpointSchema.partial();

export type CreateEndpointFormData = z.infer<typeof createEndpointSchema>;
export type UpdateEndpointFormData = z.infer<typeof updateEndpointSchema>;

// Auth schemas
export const loginSchema = z.object({
  name: z.string().min(1, "Username is required").max(50, "Username is too long"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  name: z.string().min(3, "Username must be at least 3 characters").max(50, "Username is too long"),
  password: z.string().min(6, "Password must be at least 6 characters").max(100, "Password is too long"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;

// User management schemas
export const createUserSchema = z.object({
  name: z.string().min(3, "Username must be at least 3 characters").max(50, "Username is too long"),
  password: z.string().min(6, "Password must be at least 6 characters").max(100, "Password is too long"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  status: z.enum(["enabled", "blocked"]).default("enabled"),
  role: z.enum(["admin", "user"]).default("user"),
});

export const updateUserSchema = z.object({
  name: z.string().min(3, "Username must be at least 3 characters").max(50, "Username is too long").optional(),
  password: z.string().min(6, "Password must be at least 6 characters").max(100, "Password is too long").optional().or(z.literal("")),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  status: z.enum(["enabled", "blocked"]).optional(),
  role: z.enum(["admin", "user"]).optional(),
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;

// Proxy endpoint schemas
export const createProxyEndpointSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  path: z
    .string()
    .min(1, "Path is required")
    .regex(/^\//, "Path must start with /"),
  baseUrl: z
    .string()
    .regex(/^https?:\/\//, "Base URL must start with http:// or https://")
    .optional()
    .or(z.literal("")),
  groupId: z.string().optional(),
  statusCodeOverride: z.number().int().min(100).max(599).optional(),
  enabled: z.boolean().default(true),
  useCache: z.boolean().default(false),
  delayMs: z.number().int().min(0).max(MAX_PROXY_DELAY_MS).default(0),
});

export const updateProxyEndpointSchema = createProxyEndpointSchema.partial();

export type CreateProxyEndpointFormData = z.infer<typeof createProxyEndpointSchema>;
export type UpdateProxyEndpointFormData = z.infer<typeof updateProxyEndpointSchema>;
