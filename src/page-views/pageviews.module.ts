import { Module } from '@nestjs/common';
import { PageViewsService } from './pageviews.service';
import { PageViewsController } from './pageviews.controller';

@Module({
  controllers: [PageViewsController],
  providers: [PageViewsService],
  exports: [PageViewsService],
})
export class PageViewsModule {}
