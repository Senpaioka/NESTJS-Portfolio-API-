import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpsertResumeDto } from './dto/upsert-resume.dto';

@Injectable()
export class ResumesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create or update the resume for the current user
   */
  async upsert(userId: string, dto: UpsertResumeDto) {
    return this.prisma.resume.upsert({
      where: { user_id: userId },
      create: {
        user_id: userId,
        public_url: dto.public_url,
        storage_path: dto.storage_path,
        file_name: dto.file_name,
        file_size: dto.file_size,
        mime_type: dto.mime_type,
      },
      update: {
        public_url: dto.public_url,
        storage_path: dto.storage_path,
        file_name: dto.file_name,
        file_size: dto.file_size,
        mime_type: dto.mime_type,
      },
    });
  }

  /**
   * Find the resume for the current user
   */
  async findForUser(userId: string) {
    const resume = await this.prisma.resume.findUnique({
      where: { user_id: userId },
    });

    if (!resume) {
      throw new NotFoundException('Resume not found.');
    }

    return resume;
  }

  /**
   * Delete the resume for the current user
   */
  async delete(userId: string) {
    const resume = await this.prisma.resume.findUnique({
      where: { user_id: userId },
    });

    if (!resume) {
      throw new NotFoundException('Resume not found.');
    }

    return this.prisma.resume.delete({
      where: { user_id: userId },
    });
  }
}
