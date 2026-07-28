import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { LocationType } from '@prisma/client';

@Injectable()
export class ExperiencesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new experience record for the user
   */
  async create(userId: string, dto: CreateExperienceDto) {
    return this.prisma.experience.create({
      data: {
        user_id: userId,
        company_name: dto.company_name,
        company_url: dto.company_url || null,
        position: dto.position,
        employment_type: dto.employment_type || null,
        location: dto.location || null,
        location_type: dto.location_type as LocationType || null,
        start_date: dto.start_date,
        end_date: dto.end_date || null,
        description: dto.description || null,
        assigned_tasks: dto.assigned_tasks || [],
        skills: dto.skills || [],
      },
    });
  }

  /**
   * Find all experience records for a specific user
   */
  async findAllForUser(userId: string) {
    return this.prisma.experience.findMany({
      where: { user_id: userId },
      orderBy: { start_date: 'desc' },
    });
  }

  /**
   * Update a specific experience record for a user
   */
  async update(userId: string, id: string, dto: UpdateExperienceDto) {
    const experience = await this.prisma.experience.findFirst({
      where: { id, user_id: userId },
    });

    if (!experience) {
      throw new NotFoundException(`Experience with ID "${id}" not found.`);
    }

    return this.prisma.experience.update({
      where: { id },
      data: {
        company_name: dto.company_name,
        company_url: dto.company_url === '' ? null : dto.company_url,
        position: dto.position,
        employment_type: dto.employment_type,
        location: dto.location,
        location_type: dto.location_type as LocationType,
        start_date: dto.start_date,
        end_date: dto.end_date,
        description: dto.description,
        assigned_tasks: dto.assigned_tasks,
        skills: dto.skills,
      },
    });
  }

  /**
   * Delete a specific experience record for a user
   */
  async delete(userId: string, id: string) {
    const experience = await this.prisma.experience.findFirst({
      where: { id, user_id: userId },
    });

    if (!experience) {
      throw new NotFoundException(`Experience with ID "${id}" not found.`);
    }

    return this.prisma.experience.delete({
      where: { id },
    });
  }
}
