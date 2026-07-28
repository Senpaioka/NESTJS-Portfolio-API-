import { z } from 'zod';

export const CreateSkillSchema = z.object({
  name: z.string().trim().min(1, 'Skill name is required.').max(100),
  category: z.string().trim().max(100).nullable().optional(),
  level: z.string().trim().max(50).nullable().optional(),
});

export const UpdateSkillSchema = CreateSkillSchema.partial();
