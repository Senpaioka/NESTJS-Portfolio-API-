import { z } from 'zod';

export const DeactivateAccountSchema = z.object({
  token: z.string().min(1, 'Deactivation token is required.'),
});
