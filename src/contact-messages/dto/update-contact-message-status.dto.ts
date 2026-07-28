import { createZodDto } from 'nestjs-zod';
import { UpdateContactMessageStatusSchema } from '../schemas/contact-message.schema';

export class UpdateContactMessageStatusDto extends createZodDto(UpdateContactMessageStatusSchema) {}
