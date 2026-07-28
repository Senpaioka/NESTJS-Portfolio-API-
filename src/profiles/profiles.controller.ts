import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get('me')
  async getOwnProfile(@CurrentUser() user: JwtPayload) {
    return this.profilesService.getOwnProfile(user.sub);
  }

  @Put('me')
  async updateProfile(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.profilesService.updateProfile(user.sub, dto);
  }

  @Public()
  @Get(':username')
  async getPublicProfile(@Param('username') username: string) {
    return this.profilesService.getPublicProfile(username);
  }
}
