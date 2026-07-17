import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { SkipThrottle } from '@nestjs/throttler';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @SkipThrottle()
  @Get('health')
  health() {
    return {
      success: true,
      message: 'Portfolio API is running 🚀',
      timestamp: new Date(),
    };
  }
}
