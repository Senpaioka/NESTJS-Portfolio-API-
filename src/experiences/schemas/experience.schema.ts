import { z } from 'zod';

export const LocationTypeSchema = z.enum(['REMOTE', 'HYBRID', 'ON_SITE']);

export const CreateExperienceSchema = z.object({
  company_name: z.string().trim().min(1, 'Company name is required.').max(100),
  company_url: z.string().url('Please enter a valid URL.').trim().nullable().optional().or(z.literal('')),
  position: z.string().trim().min(1, 'Position is required.').max(100),
  employment_type: z.string().trim().max(50).nullable().optional(),
  location: z.string().trim().max(100).nullable().optional(),
  location_type: LocationTypeSchema.nullable().optional(),
  start_date: z.preprocess((arg) => (typeof arg === 'string' ? new Date(arg) : arg), z.date()),
  end_date: z.preprocess((arg) => (typeof arg === 'string' ? new Date(arg) : arg), z.date().nullable().optional()),
  description: z.string().trim().max(2000).nullable().optional(),
  assigned_tasks: z.array(z.string().trim()).optional().default([]),
  skills: z.array(z.string().trim()).optional().default([]),
});

export const UpdateExperienceSchema = CreateExperienceSchema.partial();
