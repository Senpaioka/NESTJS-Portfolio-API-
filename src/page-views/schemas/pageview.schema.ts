import { z } from 'zod';

export const LogPageViewSchema = z.object({
  ip_address: z.string().trim().max(45).nullable().optional(),
  referrer: z.string().trim().max(255).nullable().optional(),
  device: z.string().trim().max(100).nullable().optional(),
  country: z.string().trim().max(100).nullable().optional(),
});
