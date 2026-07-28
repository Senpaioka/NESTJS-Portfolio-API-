import { createZodDto } from 'nestjs-zod';
import { UpsertResumeSchema } from '../schemas/resume.schema';

export class UpsertResumeDto extends createZodDto(UpsertResumeSchema) {}
