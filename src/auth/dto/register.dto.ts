import { createZodDto } from 'nestjs-zod';
import { RegisterSchema } from '../schemas/register.schema';

export class RegisterDto extends createZodDto(RegisterSchema) {}
