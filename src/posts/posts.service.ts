import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new post for a user
   */
  async create(userId: string, dto: CreatePostDto) {
    const slug = dto.slug ? dto.slug : this.generateSlug(dto.title);

    // Check if slug already exists for this user
    const existingPost = await this.prisma.post.findUnique({
      where: {
        user_id_slug: {
          user_id: userId,
          slug,
        },
      },
    });

    if (existingPost) {
      throw new ConflictException(
        `A post with the slug "${slug}" already exists for this user.`,
      );
    }

    return this.prisma.post.create({
      data: {
        user_id: userId,
        title: dto.title,
        slug,
        content: dto.content,
        featured_image: dto.featured_image || null,
        is_published: dto.is_published ?? false,
        published_at: dto.is_published ? new Date() : null,
      },
    });
  }

  /**
   * Find all posts (published and drafts) for the owner user
   */
  async findAllForUser(userId: string) {
    return this.prisma.post.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
    });
  }

  /**
   * Find a specific post for the owner user
   */
  async findOneForUser(userId: string, id: string) {
    const post = await this.prisma.post.findFirst({
      where: { id, user_id: userId },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID "${id}" not found.`);
    }

    return post;
  }

  /**
   * Update a post
   */
  async update(userId: string, id: string, dto: UpdatePostDto) {
    const post = await this.prisma.post.findFirst({
      where: { id, user_id: userId },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID "${id}" not found.`);
    }

    let slug = post.slug;
    if (dto.title && !dto.slug && post.title !== dto.title) {
      slug = this.generateSlug(dto.title);
    } else if (dto.slug) {
      slug = dto.slug;
    }

    if (slug !== post.slug) {
      const existingPost = await this.prisma.post.findUnique({
        where: {
          user_id_slug: {
            user_id: userId,
            slug,
          },
        },
      });

      if (existingPost && existingPost.id !== id) {
        throw new ConflictException(
          `A post with the slug "${slug}" already exists for this user.`,
        );
      }
    }

    // Handle published_at state transitions
    let publishedAt = post.published_at;
    if (dto.is_published !== undefined) {
      if (dto.is_published && !post.is_published) {
        publishedAt = new Date();
      } else if (!dto.is_published && post.is_published) {
        publishedAt = null;
      }
    }

    return this.prisma.post.update({
      where: { id },
      data: {
        title: dto.title,
        slug,
        content: dto.content,
        featured_image: dto.featured_image === '' ? null : dto.featured_image,
        is_published: dto.is_published,
        published_at: publishedAt,
      },
    });
  }

  /**
   * Delete a post
   */
  async delete(userId: string, id: string) {
    const post = await this.prisma.post.findFirst({
      where: { id, user_id: userId },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID "${id}" not found.`);
    }

    return this.prisma.post.delete({
      where: { id },
    });
  }

  /**
   * Public: Find all published posts for a user by username
   */
  async findPublicPostsByUser(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      throw new NotFoundException(`User with username "${username}" not found.`);
    }

    return this.prisma.post.findMany({
      where: {
        user_id: user.id,
        is_published: true,
      },
      orderBy: { published_at: 'desc' },
    });
  }

  /**
   * Public: Find a single published post by username and slug
   */
  async findPublicPostBySlug(username: string, slug: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      throw new NotFoundException(`User with username "${username}" not found.`);
    }

    const post = await this.prisma.post.findUnique({
      where: {
        user_id_slug: {
          user_id: user.id,
          slug,
        },
      },
    });

    if (!post || !post.is_published) {
      throw new NotFoundException(`Post with slug "${slug}" not found.`);
    }

    return post;
  }

  /**
   * Helper to slugify titles
   */
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
