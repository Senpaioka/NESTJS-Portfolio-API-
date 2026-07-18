import { createZodDto } from 'nestjs-zod';
import { ForgotPasswordSchema } from '../schemas/forget-password.schema';

export class ForgotPasswordDto extends createZodDto(ForgotPasswordSchema) {}
