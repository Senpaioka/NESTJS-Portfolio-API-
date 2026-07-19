import { createZodDto } from 'nestjs-zod';
import { ResetPasswordSchema } from '../schemas/reset-password.schema';

export class ResetPasswordDto extends createZodDto(ResetPasswordSchema) {}
