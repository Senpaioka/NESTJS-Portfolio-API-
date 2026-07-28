import { z } from 'zod';

export const CreateProjectSchema = z.object({
  project_name: z.string().trim().min(1, 'Project name is required.').max(150),
  short_description: z.string().trim().max(255).nullable().optional(),
  description: z.string().trim().max(5000).nullable().optional(),
  project_url: z.string().url('Please enter a valid URL.').trim().nullable().optional().or(z.literal('')),
  live_url: z.string().url('Please enter a valid URL.').trim().nullable().optional().or(z.literal('')),
  public_url: z.string().url('Please enter a valid URL.').trim().nullable().optional().or(z.literal('')),
  storage_path: z.string().trim().nullable().optional(),
  is_featured: z.boolean().optional().default(false),
  start_date: z.preprocess((arg) => (typeof arg === 'string' ? new Date(arg) : arg), z.date().nullable().optional()),
  end_date: z.preprocess((arg) => (typeof arg === 'string' ? new Date(arg) : arg), z.date().nullable().optional()),
  skill_ids: z.array(z.string().uuid('Invalid skill ID format.')).optional(),
});

export const UpdateProjectSchema = CreateProjectSchema.partial();
