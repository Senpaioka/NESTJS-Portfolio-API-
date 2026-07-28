import { createZodDto } from 'nestjs-zod';
import { UpdateEducationSchema } from '../schemas/education.schema';

export class UpdateEducationDto extends createZodDto(UpdateEducationSchema) {}
