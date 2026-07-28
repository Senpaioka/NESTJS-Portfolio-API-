import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
} from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { UpsertResumeDto } from './dto/upsert-resume.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @Post('me')
  async upsert(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpsertResumeDto,
  ) {
    return this.resumesService.upsert(user.sub, dto);
  }

  @Get('me')
  async findForUser(@CurrentUser() user: JwtPayload) {
    return this.resumesService.findForUser(user.sub);
  }

  @Delete('me')
  async delete(@CurrentUser() user: JwtPayload) {
    return this.resumesService.delete(user.sub);
  }
}
