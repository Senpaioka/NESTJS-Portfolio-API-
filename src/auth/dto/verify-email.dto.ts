import { IsEmail, IsString, Length } from 'class-validator';

export class VerifyEmailDto {
  @IsEmail()
  email: string | undefined;

  @IsString()
  @Length(6, 6)
  otp: string | undefined;
}
