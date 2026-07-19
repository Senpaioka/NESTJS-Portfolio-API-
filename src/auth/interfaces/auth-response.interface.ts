import type { User } from '@prisma/client';

// Define a type-safe response structure mapping directly to your Prisma schema
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: User['id'];
    email: User['email'];
    username: User['username'];
    role: User['role'];
  };
}
