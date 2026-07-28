import { z } from 'zod';

export const CreateEducationSchema = z.object({
  institution: z.string().trim().min(1, 'Institution is required.').max(150),
  degree: z.string().trim().min(1, 'Degree is required.').max(100),
  field_of_study: z.string().trim().max(100).nullable().optional(),
  start_date: z.preprocess((arg) => (typeof arg === 'string' ? new Date(arg) : arg), z.date()),
  end_date: z.preprocess((arg) => (typeof arg === 'string' ? new Date(arg) : arg), z.date().nullable().optional()),
  grade: z.string().trim().max(50).nullable().optional(),
  description: z.string().trim().max(1000).nullable().optional(),
});

export const UpdateEducationSchema = CreateEducationSchema.partial();
