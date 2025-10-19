import { z } from "zod";

// Maximum delay: 1 minute (60000ms) to prevent blocking backend
export const MAX_DELAY_MS = 60000;

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
