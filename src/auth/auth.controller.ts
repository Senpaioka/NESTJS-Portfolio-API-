import {
  Body,
  Controller,
  Post,
  UseGuards,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forget-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ResendVerificationOtpDto } from './dto/resend-verification-otp.dto';
import { DeactivateAccountDto } from './dto/deactivate-account.dto';
import { Public } from './decorators/public.decorator';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import type { JwtPayload } from './interfaces/jwt-payload.interface';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // refresh-token handler
  private setRefreshTokenCookie(
    response: Response,
    refreshToken: string,
  ): void {
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }

  // register
  @Public()
  @Throttle({ default: { limit: 5, ttl: 600000 } }) // 5 requests / 10 minutes
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  // refresh token
  @Public()
  @Throttle({ default: { limit: 20, ttl: 60000 } }) // 20 requests / minute
  @UseGuards(RefreshTokenGuard)
  @Post('refresh-token')
  async refreshToken(
    @CurrentUser() user: JwtPayload,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies?.refreshToken as string | undefined;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing from cookies');
    }

    // TypeScript now guarantees that 'refreshToken' is strictly a string here!
    const tokens = await this.authService.refreshTokens(user.sub, refreshToken);

    // Set HTTP-Only cookie for refresh token
    this.setRefreshTokenCookie(response, refreshToken);

    return { accessToken: tokens.accessToken, user: tokens.user };
  }

  // login
  @Public()
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 requests / 1 minute
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { accessToken, refreshToken, user } =
      await this.authService.login(dto);

    // Set HTTP-Only cookie for refresh token
    this.setRefreshTokenCookie(response, refreshToken);

    return { accessToken, user };
  }

  // logout
  @Post('logout')
  async logout(
    @CurrentUser() user: JwtPayload,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.logout(user.sub);
    response.clearCookie('refreshToken');
    return { message: 'Logged out successfully' };
  }

  // forget password
  @Public()
  @Throttle({ default: { limit: 3, ttl: 600000 } }) // 3 requests / 10 minutes
  @Post('forget-password')
  async forgetPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  // reset password
  @Public()
  @Throttle({ default: { limit: 10, ttl: 600000 } }) // 10 requests / 10 minutes
  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  // verify email
  @Public()
  @Throttle({ default: { limit: 10, ttl: 600000 } }) // 10 requests / 10 minutes
  @Post('verify-email')
  async verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.authService.verifyEmail(dto);
  }

  // resend verification OTP
  @Public()
  @Throttle({ default: { limit: 3, ttl: 600000 } }) // 3 requests / 10 minutes
  @Post('resend-verification-otp')
  async resendVerificationOtp(@Body() dto: ResendVerificationOtpDto) {
    return this.authService.resendVerificationOtp(dto);
  }

  // deactivate account
  @Public()
  @Throttle({ default: { limit: 5, ttl: 600000 } }) // 5 requests / 10 minutes
  @Post('deactivate-account')
  async deactivateAccount(@Body() dto: DeactivateAccountDto) {
    return this.authService.deactivateAccount(dto);
  }
}
