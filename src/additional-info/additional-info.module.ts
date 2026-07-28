import { Module } from '@nestjs/common';
import { AdditionalInfoService } from './additional-info.service';
import { AdditionalInfoController } from './additional-info.controller';

@Module({
  controllers: [AdditionalInfoController],
  providers: [AdditionalInfoService],
  exports: [AdditionalInfoService],
})
export class AdditionalInfoModule {}
