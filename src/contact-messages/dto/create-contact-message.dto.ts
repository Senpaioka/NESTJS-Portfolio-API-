import { createZodDto } from 'nestjs-zod';
import { CreateContactMessageSchema } from '../schemas/contact-message.schema';

export class CreateContactMessageDto extends createZodDto(CreateContactMessageSchema) {}
