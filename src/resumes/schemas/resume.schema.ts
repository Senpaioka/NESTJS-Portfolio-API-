import { z } from 'zod';

export const UpsertResumeSchema = z.object({
  public_url: z.string().url('Please enter a valid URL.').trim().max(255),
  storage_path: z.string().trim().min(1, 'Storage path is required.').max(255),
  file_name: z.string().trim().max(255).nullable().optional(),
  file_size: z.number().int().min(0).nullable().optional(),
  mime_type: z.string().trim().max(100).nullable().optional().default('application/pdf'),
});
