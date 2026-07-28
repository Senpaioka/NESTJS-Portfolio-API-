import { z } from 'zod';

export const CreatePostSchema = z.object({
  title: z.string().trim().min(1, 'Title is required.').max(200),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format. Use lowercase alphanumeric characters and hyphens.')
    .max(250)
    .optional(),
  content: z.string().min(1, 'Content is required.'),
  featured_image: z.string().url('Please enter a valid URL.').trim().nullable().optional().or(z.literal('')),
  is_published: z.boolean().optional().default(false),
});

export const UpdatePostSchema = CreatePostSchema.partial();
