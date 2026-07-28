import { createZodDto } from 'nestjs-zod';
import { UpdateProjectSchema } from '../schemas/project.schema';

export class UpdateProjectDto extends createZodDto(UpdateProjectSchema) {}
