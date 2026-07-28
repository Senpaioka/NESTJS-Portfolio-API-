import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAdditionalInfoDto } from './dto/create-additional-info.dto';
import { UpdateAdditionalInfoDto } from './dto/update-additional-info.dto';

@Injectable()
export class AdditionalInfoService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new additional info record for the user
   */
  async create(userId: string, dto: CreateAdditionalInfoDto) {
    return this.prisma.additionalInfo.create({
      data: {
        user_id: userId,
        title: dto.title,
        sub_title: dto.sub_title || null,
        options: dto.options || [],
        info_body: dto.info_body || null,
        is_visible: dto.is_visible ?? true,
      },
    });
  }

  /**
   * Find all additional info records for a specific user
   */
  async findAllForUser(userId: string) {
    return this.prisma.additionalInfo.findMany({
      where: { user_id: userId },
    });
  }

  /**
   * Update a specific additional info record for a user
   */
  async update(userId: string, id: string, dto: UpdateAdditionalInfoDto) {
    const additionalInfo = await this.prisma.additionalInfo.findFirst({
      where: { id, user_id: userId },
    });

    if (!additionalInfo) {
      throw new NotFoundException(`Additional info with ID "${id}" not found.`);
    }

    return this.prisma.additionalInfo.update({
      where: { id },
      data: {
        title: dto.title,
        sub_title: dto.sub_title,
        options: dto.options,
        info_body: dto.info_body,
        is_visible: dto.is_visible,
      },
    });
  }

  /**
   * Delete a specific additional info record for a user
   */
  async delete(userId: string, id: string) {
    const additionalInfo = await this.prisma.additionalInfo.findFirst({
      where: { id, user_id: userId },
    });

    if (!additionalInfo) {
      throw new NotFoundException(`Additional info with ID "${id}" not found.`);
    }

    return this.prisma.additionalInfo.delete({
      where: { id },
    });
  }
}
