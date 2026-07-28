import { createZodDto } from 'nestjs-zod';
import { CreateEducationSchema } from '../schemas/education.schema';

export class CreateEducationDto extends createZodDto(CreateEducationSchema) {}
