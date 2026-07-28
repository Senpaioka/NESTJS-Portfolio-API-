import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';

@Injectable()
export class EducationsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new education record for the user
   */
  async create(userId: string, dto: CreateEducationDto) {
    return this.prisma.education.create({
      data: {
        user_id: userId,
        institution: dto.institution,
        degree: dto.degree,
        field_of_study: dto.field_of_study || null,
        start_date: dto.start_date,
        end_date: dto.end_date || null,
        grade: dto.grade || null,
        description: dto.description || null,
      },
    });
  }

  /**
   * Find all education records for a specific user
   */
  async findAllForUser(userId: string) {
    return this.prisma.education.findMany({
      where: { user_id: userId },
      orderBy: { start_date: 'desc' },
    });
  }

  /**
   * Update a specific education record for a user
   */
  async update(userId: string, id: string, dto: UpdateEducationDto) {
    const education = await this.prisma.education.findFirst({
      where: { id, user_id: userId },
    });

    if (!education) {
      throw new NotFoundException(`Education with ID "${id}" not found.`);
    }

    return this.prisma.education.update({
      where: { id },
      data: {
        institution: dto.institution,
        degree: dto.degree,
        field_of_study: dto.field_of_study,
        start_date: dto.start_date,
        end_date: dto.end_date,
        grade: dto.grade,
        description: dto.description,
      },
    });
  }

  /**
   * Delete a specific education record for a user
   */
  async delete(userId: string, id: string) {
    const education = await this.prisma.education.findFirst({
      where: { id, user_id: userId },
    });

    if (!education) {
      throw new NotFoundException(`Education with ID "${id}" not found.`);
    }

    return this.prisma.education.delete({
      where: { id },
    });
  }
}
