import { z } from 'zod';

export const UpdateProfileSchema = z.object({
  full_name: z.string().trim().max(100).nullable().optional(),
  title: z.string().trim().max(100).nullable().optional(),
  tagline: z.string().trim().max(150).nullable().optional(),
  public_email: z.string().email('Please enter a valid email.').trim().nullable().optional(),
  public_phone: z.string().trim().max(30).nullable().optional(),
  bio_text: z.string().trim().max(1000).nullable().optional(),
  professional_summary: z.string().trim().max(5000).nullable().optional(),
  location: z.string().trim().max(100).nullable().optional(),
  is_available_for_hire: z.boolean().optional(),
  languages: z.array(z.string().trim()).optional(),
  year_of_experience: z.number().int().min(0).max(100).optional(),
  theme: z.string().trim().max(30).optional(),
  
  // Storage URLs & paths
  dp_public_url: z.string().url().nullable().optional(),
  dp_storage_path: z.string().nullable().optional(),
  cover_image_public_url: z.string().url().nullable().optional(),
  cover_image_storage_path: z.string().nullable().optional(),
});
