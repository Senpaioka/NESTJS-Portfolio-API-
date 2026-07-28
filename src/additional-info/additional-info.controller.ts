import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AdditionalInfoService } from './additional-info.service';
import { CreateAdditionalInfoDto } from './dto/create-additional-info.dto';
import { UpdateAdditionalInfoDto } from './dto/update-additional-info.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@Controller('additional-info')
export class AdditionalInfoController {
  constructor(private readonly additionalInfoService: AdditionalInfoService) {}

  @Post('me')
  async create(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateAdditionalInfoDto,
  ) {
    return this.additionalInfoService.create(user.sub, dto);
  }

  @Get('me')
  async findAll(@CurrentUser() user: JwtPayload) {
    return this.additionalInfoService.findAllForUser(user.sub);
  }

  @Patch('me/:id')
  async update(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: UpdateAdditionalInfoDto,
  ) {
    return this.additionalInfoService.update(user.sub, id, dto);
  }

  @Delete('me/:id')
  async delete(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.additionalInfoService.delete(user.sub, id);
  }
}
