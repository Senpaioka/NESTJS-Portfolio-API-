import { createZodDto } from 'nestjs-zod';
import { UpdateExperienceSchema } from '../schemas/experience.schema';

export class UpdateExperienceDto extends createZodDto(UpdateExperienceSchema) {}
