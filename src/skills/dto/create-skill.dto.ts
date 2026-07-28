import { createZodDto } from 'nestjs-zod';
import { CreateSkillSchema } from '../schemas/skill.schema';

export class CreateSkillDto extends createZodDto(CreateSkillSchema) {}
