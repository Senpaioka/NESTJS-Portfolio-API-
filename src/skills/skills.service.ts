import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';

@Injectable()
export class SkillsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new skill for the user
   */
  async create(userId: string, dto: CreateSkillDto) {
    try {
      return await this.prisma.skill.create({
        data: {
          user_id: userId,
          name: dto.name,
          category: dto.category,
          level: dto.level,
        },
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          `A skill with name "${dto.name}" already exists.`,
        );
      }
      throw error;
    }
  }

  /**
   * Find all skills for a specific user
   */
  async findAllForUser(userId: string) {
    return this.prisma.skill.findMany({
      where: { user_id: userId },
      orderBy: { name: 'asc' },
    });
  }

  /**
   * Update a specific skill for a user
   */
  async update(userId: string, id: string, dto: UpdateSkillDto) {
    const skill = await this.prisma.skill.findFirst({
      where: { id, user_id: userId },
    });

    if (!skill) {
      throw new NotFoundException(`Skill with ID "${id}" not found.`);
    }

    try {
      return await this.prisma.skill.update({
        where: { id },
        data: dto,
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          `A skill with name "${dto.name}" already exists.`,
        );
      }
      throw error;
    }
  }

  /**
   * Delete a specific skill for a user
   */
  async delete(userId: string, id: string) {
    const skill = await this.prisma.skill.findFirst({
      where: { id, user_id: userId },
    });

    if (!skill) {
      throw new NotFoundException(`Skill with ID "${id}" not found.`);
    }

    return this.prisma.skill.delete({
      where: { id },
    });
  }
}
