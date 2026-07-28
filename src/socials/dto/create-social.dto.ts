import { createZodDto } from 'nestjs-zod';
import { CreateSocialSchema } from '../schemas/social.schema';

export class CreateSocialDto extends createZodDto(CreateSocialSchema) {}
