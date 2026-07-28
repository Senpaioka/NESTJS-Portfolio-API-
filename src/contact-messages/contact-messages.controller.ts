import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ContactMessagesService } from './contact-messages.service';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';
import { UpdateContactMessageStatusDto } from './dto/update-contact-message-status.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@Controller('contact-messages')
export class ContactMessagesController {
  constructor(private readonly contactMessagesService: ContactMessagesService) {}

  @Public()
  @Post(':username')
  async create(
    @Param('username') username: string,
    @Body() dto: CreateContactMessageDto,
  ) {
    return this.contactMessagesService.create(username, dto);
  }

  @Get('me')
  async findAll(@CurrentUser() user: JwtPayload) {
    return this.contactMessagesService.findAllForUser(user.sub);
  }

  @Patch('me/:id/read')
  async updateStatus(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: UpdateContactMessageStatusDto,
  ) {
    return this.contactMessagesService.updateStatus(user.sub, id, dto);
  }

  @Delete('me/:id')
  async delete(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.contactMessagesService.delete(user.sub, id);
  }
}
