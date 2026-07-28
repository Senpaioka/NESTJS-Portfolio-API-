import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new project for the user
   */
  async create(userId: string, dto: CreateProjectDto) {
    const { skill_ids, ...rest } = dto;

    const skillsConnection = skill_ids && skill_ids.length > 0 
      ? { connect: skill_ids.map(id => ({ id })) } 
      : undefined;

    return this.prisma.project.create({
      data: {
        user_id: userId,
        project_name: rest.project_name,
        short_description: rest.short_description,
        description: rest.description,
        project_url: rest.project_url || null,
        live_url: rest.live_url || null,
        public_url: rest.public_url || null,
        storage_path: rest.storage_path,
        is_featured: rest.is_featured ?? false,
        start_date: rest.start_date,
        end_date: rest.end_date,
        skills: skillsConnection,
      },
      include: {
        skills: true,
      },
    });
  }

  /**
   * Find all projects for a specific user
   */
  async findAllForUser(userId: string) {
    return this.prisma.project.findMany({
      where: { user_id: userId },
      include: {
        skills: true,
      },
      orderBy: { is_featured: 'desc' },
    });
  }

  /**
   * Update a specific project for a user
   */
  async update(userId: string, id: string, dto: UpdateProjectDto) {
    const project = await this.prisma.project.findFirst({
      where: { id, user_id: userId },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID "${id}" not found.`);
    }

    const { skill_ids, ...rest } = dto;

    const skillsConnection = skill_ids 
      ? { set: skill_ids.map(id => ({ id })) } 
      : undefined;

    return this.prisma.project.update({
      where: { id },
      data: {
        project_name: rest.project_name,
        short_description: rest.short_description,
        description: rest.description,
        project_url: rest.project_url === '' ? null : rest.project_url,
        live_url: rest.live_url === '' ? null : rest.live_url,
        public_url: rest.public_url === '' ? null : rest.public_url,
        storage_path: rest.storage_path,
        is_featured: rest.is_featured,
        start_date: rest.start_date,
        end_date: rest.end_date,
        skills: skillsConnection,
      },
      include: {
        skills: true,
      },
    });
  }

  /**
   * Delete a specific project for a user
   */
  async delete(userId: string, id: string) {
    const project = await this.prisma.project.findFirst({
      where: { id, user_id: userId },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID "${id}" not found.`);
    }

    return this.prisma.project.delete({
      where: { id },
    });
  }
}
