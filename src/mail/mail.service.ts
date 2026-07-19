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
      template: 'verify-email',
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
  ): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Your Password Has Been Changed',
      template: 'password-changed',
      context: {
        username,
      },
    });
  }

  // eslint-disable-next-line prettier/prettier
  async sendWelcomeEmail(
    email: string,
    username: string,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome!',
      template: 'welcome',
      context: {
        username,
      },
    });
  }
}
