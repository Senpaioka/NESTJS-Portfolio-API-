import { createZodDto } from 'nestjs-zod';
import { UpdateAdditionalInfoSchema } from '../schemas/additional-info.schema';

export class UpdateAdditionalInfoDto extends createZodDto(UpdateAdditionalInfoSchema) {}
