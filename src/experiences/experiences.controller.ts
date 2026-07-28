import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ExperiencesService } from './experiences.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@Controller('experiences')
export class ExperiencesController {
  constructor(private readonly experiencesService: ExperiencesService) {}

  @Post('me')
  async create(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateExperienceDto,
  ) {
    return this.experiencesService.create(user.sub, dto);
  }

  @Get('me')
  async findAll(@CurrentUser() user: JwtPayload) {
    return this.experiencesService.findAllForUser(user.sub);
  }

  @Patch('me/:id')
  async update(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: UpdateExperienceDto,
  ) {
    return this.experiencesService.update(user.sub, id, dto);
  }

  @Delete('me/:id')
  async delete(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.experiencesService.delete(user.sub, id);
  }
}
