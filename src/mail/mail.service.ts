import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendVerificationEmail(
    email: string,
    username: string,
    otp: string,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Verify Your Email',
      template: 'auth/verify-email',
      context: {
        username,
        otp,
      },
    });
  }

  async sendForgotPasswordEmail(
    email: string,
    username: string,
    otp: string,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Password Reset Code',
      template: 'auth/forgot-password',
      context: {
        username,
        otp,
      },
    });
  }

  async sendPasswordChangedEmail(
    email: string,
    username: string,
    deactivateUrl?: string,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Your Password Has Been Changed',
      template: 'auth/password-changed',
      context: {
        username,
        deactivateUrl:
          deactivateUrl ||
          `${process.env.CLIENT_URL || 'http://localhost:3000'}/deactivate-account`,
        year: new Date().getFullYear(),
      },
    });
  }

  async sendWelcomeEmail(
    email: string,
    username: string,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome!',
      template: 'auth/welcome',
      context: {
        username,
        loginUrl: process.env.CLIENT_LOGIN_URL || 'http://localhost:3000/login',
        year: new Date().getFullYear(),
      },
    });
  }
}
