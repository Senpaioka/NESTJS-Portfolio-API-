import { createZodDto } from 'nestjs-zod';
import { UpdateSkillSchema } from '../schemas/skill.schema';

export class UpdateSkillDto extends createZodDto(UpdateSkillSchema) {}
