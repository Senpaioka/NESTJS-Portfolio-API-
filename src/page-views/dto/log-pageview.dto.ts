import { createZodDto } from 'nestjs-zod';
import { LogPageViewSchema } from '../schemas/pageview.schema';

export class LogPageViewDto extends createZodDto(LogPageViewSchema) {}
