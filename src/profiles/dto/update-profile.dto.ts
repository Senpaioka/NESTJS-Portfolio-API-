import { createZodDto } from 'nestjs-zod';
import { UpdateProfileSchema } from '../schemas/update-profile.schema';

export class UpdateProfileDto extends createZodDto(UpdateProfileSchema) {}
