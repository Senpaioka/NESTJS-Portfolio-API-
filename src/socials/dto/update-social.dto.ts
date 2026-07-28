import { createZodDto } from 'nestjs-zod';
import { UpdateSocialSchema } from '../schemas/social.schema';

export class UpdateSocialDto extends createZodDto(UpdateSocialSchema) {}
