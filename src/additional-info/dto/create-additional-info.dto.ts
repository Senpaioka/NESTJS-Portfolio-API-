import { createZodDto } from 'nestjs-zod';
import { CreateAdditionalInfoSchema } from '../schemas/additional-info.schema';

export class CreateAdditionalInfoDto extends createZodDto(CreateAdditionalInfoSchema) {}
