import { createZodDto } from 'nestjs-zod';
import { CreatePostSchema } from '../schemas/post.schema';

export class CreatePostDto extends createZodDto(CreatePostSchema) {}
