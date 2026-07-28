import { createZodDto } from 'nestjs-zod';
import { CreateProjectSchema } from '../schemas/project.schema';

export class CreateProjectDto extends createZodDto(CreateProjectSchema) {}
