import {
  Body,
  Controller,
  Get,
  Headers,
  Ip,
  Param,
  Post,
} from '@nestjs/common';
import { PageViewsService } from './pageviews.service';
import { LogPageViewDto } from './dto/log-pageview.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@Controller('page-views')
export class PageViewsController {
  constructor(private readonly pageViewsService: PageViewsService) {}

  @Public()
  @Post(':username')
  async logView(
    @Param('username') username: string,
    @Body() dto: LogPageViewDto,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    return this.pageViewsService.logView(username, dto, ip, userAgent);
  }

  @Get('me')
  async getStats(@CurrentUser() user: JwtPayload) {
    return this.pageViewsService.getStatsForUser(user.sub);
  }
}
