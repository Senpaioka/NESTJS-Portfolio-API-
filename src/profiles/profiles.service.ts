import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get own profile (creates one if it doesn't exist)
   */
  async getOwnProfile(userId: string) {
    return this.prisma.profile.upsert({
      where: { user_id: userId },
      create: { user_id: userId },
      update: {},
    });
  }

  /**
   * Update or create own profile
   */
  async updateProfile(userId: string, dto: UpdateProfileDto) {
    return this.prisma.profile.upsert({
      where: { user_id: userId },
      create: {
        user_id: userId,
        ...dto,
      },
      update: dto,
    });
  }

  /**
   * Fetch a user's full public portfolio profile by their username
   */
  async getPublicProfile(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        email: true,
        profile: {
          select: {
            full_name: true,
            title: true,
            tagline: true,
            public_email: true,
            public_phone: true,
            bio_text: true,
            professional_summary: true,
            location: true,
            is_available_for_hire: true,
            languages: true,
            year_of_experience: true,
            theme: true,
            dp_public_url: true,
            cover_image_public_url: true,
          },
        },
        experiences: {
          orderBy: { start_date: 'desc' },
        },
        projects: {
          orderBy: { is_featured: 'desc' },
        },
        skills: true,
        educations: {
          orderBy: { start_date: 'desc' },
        },
        social_links: {
          where: { is_visible: true },
          orderBy: { display_order: 'asc' },
        },
        additional_info: {
          where: { is_visible: true },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with username "${username}" not found`);
    }

    return user;
  }
}
