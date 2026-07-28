import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post('me')
  async create(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreatePostDto,
  ) {
    return this.postsService.create(user.sub, dto);
  }

  @Get('me')
  async findAllForOwner(@CurrentUser() user: JwtPayload) {
    return this.postsService.findAllForUser(user.sub);
  }

  @Get('me/:id')
  async findOneForOwner(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
  ) {
    return this.postsService.findOneForUser(user.sub, id);
  }

  @Patch('me/:id')
  async update(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: UpdatePostDto,
  ) {
    return this.postsService.update(user.sub, id, dto);
  }

  @Delete('me/:id')
  async delete(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.postsService.delete(user.sub, id);
  }

  @Public()
  @Get(':username')
  async findPublicPosts(@Param('username') username: string) {
    return this.postsService.findPublicPostsByUser(username);
  }

  @Public()
  @Get(':username/:slug')
  async findPublicPost(
    @Param('username') username: string,
    @Param('slug') slug: string,
  ) {
    return this.postsService.findPublicPostBySlug(username, slug);
  }
}
