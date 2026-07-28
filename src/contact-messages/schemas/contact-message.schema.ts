import { z } from 'zod';

export const CreateContactMessageSchema = z.object({
  sender_name: z.string().trim().min(1, 'Sender name is required.').max(100),
  sender_email: z.string().email('Please enter a valid email.').trim().max(150),
  subject: z.string().trim().max(150).nullable().optional(),
  message: z.string().trim().min(1, 'Message content is required.').max(2000),
});

export const UpdateContactMessageStatusSchema = z.object({
  is_read: z.boolean(),
});
