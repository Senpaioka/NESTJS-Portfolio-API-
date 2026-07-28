import { z } from 'zod';

export const CreateAdditionalInfoSchema = z.object({
  title: z.string().trim().min(1, 'Title is required.').max(100),
  sub_title: z.string().trim().max(150).nullable().optional(),
  options: z.array(z.string().trim()).optional().default([]),
  info_body: z.string().trim().max(2000).nullable().optional(),
  is_visible: z.boolean().optional().default(true),
});

export const UpdateAdditionalInfoSchema = CreateAdditionalInfoSchema.partial();
