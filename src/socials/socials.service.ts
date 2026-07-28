import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSocialDto } from './dto/create-social.dto';
import { UpdateSocialDto } from './dto/update-social.dto';

@Injectable()
export class SocialsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new social link for the user
   */
  async create(userId: string, dto: CreateSocialDto) {
    try {
      return await this.prisma.socialLink.create({
        data: {
          user_id: userId,
          platform_name: dto.platform_name,
          url: dto.url,
          icon_slug: dto.icon_slug,
          display_order: dto.display_order ?? 0,
          is_visible: dto.is_visible ?? true,
        },
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          `A social link for platform "${dto.platform_name}" already exists.`,
        );
      }
      throw error;
    }
  }

  /**
   * Find all social links for a specific user
   */
  async findAllForUser(userId: string) {
    return this.prisma.socialLink.findMany({
      where: { user_id: userId },
      orderBy: { display_order: 'asc' },
    });
  }

  /**
   * Update a specific social link for a user
   */
  async update(userId: string, id: string, dto: UpdateSocialDto) {
    const socialLink = await this.prisma.socialLink.findFirst({
      where: { id, user_id: userId },
    });

    if (!socialLink) {
      throw new NotFoundException(`Social link with ID "${id}" not found.`);
    }

    try {
      return await this.prisma.socialLink.update({
        where: { id },
        data: dto,
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          `A social link for platform "${dto.platform_name}" already exists.`,
        );
      }
      throw error;
    }
  }

  /**
   * Delete a specific social link for a user
   */
  async delete(userId: string, id: string) {
    const socialLink = await this.prisma.socialLink.findFirst({
      where: { id, user_id: userId },
    });

    if (!socialLink) {
      throw new NotFoundException(`Social link with ID "${id}" not found.`);
    }

    return this.prisma.socialLink.delete({
      where: { id },
    });
  }
}
