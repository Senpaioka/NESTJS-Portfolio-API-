import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import * as argon2 from 'argon2';

import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forget-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ResendVerificationOtpDto } from './dto/resend-verification-otp.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { Role } from '../common/enums/role.enum';
import { AuthResponse } from './interfaces/auth-response.interface';
import type { User } from '@prisma/client';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {}

  async register(dto: RegisterDto): Promise<{ message: string }> {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: dto.email }, { username: dto.username }],
      },
    });

    if (existingUser) {
      if (existingUser.email === dto.email) {
        throw new ConflictException('Email already in use.');
      }
      throw new ConflictException('Username already taken.');
    }

    const passwordHash = await argon2.hash(dto.password);

    const user = await this.prisma.user.create({
      data: {
        username: dto.username,
        email: dto.email,
        password_hash: passwordHash,
      },
    });

    // Generate a 6-digit OTP and store its hash
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await argon2.hash(otp);
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        email_verification_hash: hashedOtp,
        email_verification_expires_at: otpExpires,
      },
    });

    await this.mailService.sendVerificationEmail(
      user.email,
      user.username,
      otp,
    );

    return {
      message:
        'Registration successful. Please check your email for the verification code.',
    };
  }

  // 2. Set the return type to Promise<AuthResponseDto>
  private async generateTokens(user: User): Promise<AuthResponse> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      username: user.username,
      role: user.role as Role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
        // 2. Cast the config string to the specific expiresIn type definition
        expiresIn: this.configService.getOrThrow<string>(
          'JWT_ACCESS_EXPIRES_IN',
        ) as JwtSignOptions['expiresIn'],
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
        // 2. Cast here as well
        expiresIn: this.configService.getOrThrow<string>(
          'JWT_REFRESH_EXPIRES_IN',
        ) as JwtSignOptions['expiresIn'],
      }),
    ]);

    const hashedRefreshToken = await argon2.hash(refreshToken);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { refresh_token_hash: hashedRefreshToken },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    };
  }

  // refresh-token
  async refreshTokens(
    userId: string,
    refreshToken: string,
  ): Promise<AuthResponse> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.refresh_token_hash) {
      throw new UnauthorizedException('Access Denied');
    }

    const refreshTokenMatches = await argon2.verify(
      user.refresh_token_hash,
      refreshToken,
    );

    if (!refreshTokenMatches) {
      throw new UnauthorizedException('Access Denied');
    }

    return this.generateTokens(user);
  }

  // login
  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await argon2.verify(
      user.password_hash,
      dto.password,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens(user);
  }

  // logout
  async logout(userId: string): Promise<void> {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        refresh_token_hash: { not: null },
      },
      data: {
        refresh_token_hash: null,
      },
    });
  }

  // forget password
  async forgotPassword(
    dto: ForgotPasswordDto,
  ): Promise<{ message: string; resetToken?: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      return {
        message: 'If the email exists, a reset link has been logged/sent.',
      };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password_reset_token: hashedResetToken,
        password_reset_expires: resetExpires,
      },
    });

    return {
      message: 'Password reset token generated.',
      resetToken,
    };
  }

  // reset password
  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    const hashedResetToken = crypto
      .createHash('sha256')
      .update(dto.token)
      .digest('hex');

    const user = await this.prisma.user.findFirst({
      where: {
        password_reset_token: hashedResetToken,
        password_reset_expires: { gt: new Date() },
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired password reset token.');
    }

    const passwordHash = await argon2.hash(dto.password);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password_hash: passwordHash,
        password_reset_token: null,
        password_reset_expires: null,
      },
    });

    return { message: 'Password has been reset successfully.' };
  }

  // verify email
  async verifyEmail(dto: VerifyEmailDto): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    if (user.is_verified) {
      throw new BadRequestException('Email is already verified.');
    }

    if (!user.email_verification_hash || !user.email_verification_expires_at) {
      throw new BadRequestException('Verification code is invalid.');
    }

    if (user.email_verification_expires_at < new Date()) {
      throw new BadRequestException('Verification code has expired.');
    }

    // Explicitly narrow the types to pure strings so argon2 is completely satisfied
    const storedHash: string = user.email_verification_hash as string;
    const incomingOtp: string = String(dto.otp);

    const isValidOtp = await argon2.verify(storedHash, incomingOtp);

    if (!isValidOtp) {
      throw new BadRequestException('Invalid verification code.');
    }

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        is_verified: true,
        email_verification_hash: null,
        email_verification_expires_at: null,
      },
    });

    return {
      message: 'Email verified successfully.',
    };
  }

  // resend verified otp
  async resendVerificationOtp(
    dto: ResendVerificationOtpDto,
  ): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    // Never reveal whether an email exists.
    if (!user) {
      return {
        message: 'If the email exists, a verification code has been sent.',
      };
    }

    if (user.is_verified) {
      throw new BadRequestException('Email is already verified.');
    }

    // --- cool-down check ---
    // If a token exists and expires in 10 mins, more than 5 mins left means they requested it less than 5 mins ago.
    if (user.email_verification_expires_at) {
      // Explicitly wrap or cast the Date to ensure TypeScript resolves the call
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, prettier/prettier
      const remainingTimeMs = new Date(user.email_verification_expires_at).getTime() - Date.now();
      const fiveMinutesInMs = 5 * 60 * 1000;
      const tenMinutesInMs = 10 * 60 * 1000;

      // remainingTimeMs > 5 minutes means less than 5 minutes have passed since creation
      if (
        remainingTimeMs > fiveMinutesInMs &&
        remainingTimeMs <= tenMinutesInMs
      ) {
        throw new BadRequestException(
          'Please wait at least 5 minutes before requesting another verification code.',
        );
      }
    }
    // ----------------------

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await argon2.hash(otp);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        email_verification_hash: otpHash,
        email_verification_expires_at: expiresAt,
      },
    });

    await this.mailService.sendVerificationEmail(
      user.email,
      user.username,
      otp,
    );

    return {
      message: 'If the email exists, a verification code has been sent.',
    };
  }
}
