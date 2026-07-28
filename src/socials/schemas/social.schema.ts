import { z } from 'zod';

export const CreateSocialSchema = z.object({
  platform_name: z.string().trim().min(1, 'Platform name is required.').max(50),
  url: z.string().url('Please enter a valid URL.').trim().max(255),
  icon_slug: z.string().trim().max(50).nullable().optional(),
  display_order: z.number().int().optional(),
  is_visible: z.boolean().optional(),
});

export const UpdateSocialSchema = CreateSocialSchema.partial();
