import { createZodDto } from 'nestjs-zod';
import { DeactivateAccountSchema } from '../schemas/deactivate-account.schema';

export class DeactivateAccountDto extends createZodDto(DeactivateAccountSchema) {}
