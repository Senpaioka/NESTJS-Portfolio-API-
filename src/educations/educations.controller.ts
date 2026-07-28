import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { EducationsService } from './educations.service';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@Controller('educations')
export class EducationsController {
  constructor(private readonly educationsService: EducationsService) {}

  @Post('me')
  async create(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateEducationDto,
  ) {
    return this.educationsService.create(user.sub, dto);
  }

  @Get('me')
  async findAll(@CurrentUser() user: JwtPayload) {
    return this.educationsService.findAllForUser(user.sub);
  }

  @Patch('me/:id')
  async update(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: UpdateEducationDto,
  ) {
    return this.educationsService.update(user.sub, id, dto);
  }

  @Delete('me/:id')
  async delete(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.educationsService.delete(user.sub, id);
  }
}
