import { createZodDto } from 'nestjs-zod';
import { CreateExperienceSchema } from '../schemas/experience.schema';

export class CreateExperienceDto extends createZodDto(CreateExperienceSchema) {}
