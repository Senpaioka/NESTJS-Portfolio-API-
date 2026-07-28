import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';
import { UpdateContactMessageStatusDto } from './dto/update-contact-message-status.dto';

@Injectable()
export class ContactMessagesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a contact message for a recipient user (by username)
   */
  async create(username: string, dto: CreateContactMessageDto) {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      throw new NotFoundException(`User with username "${username}" not found.`);
    }

    return this.prisma.contactMessage.create({
      data: {
        user_id: user.id,
        sender_name: dto.sender_name,
        sender_email: dto.sender_email,
        subject: dto.subject || null,
        message: dto.message,
      },
    });
  }

  /**
   * Find all contact messages for a specific user
   */
  async findAllForUser(userId: string) {
    return this.prisma.contactMessage.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
    });
  }

  /**
   * Update the status (is_read) of a contact message
   */
  async updateStatus(userId: string, id: string, dto: UpdateContactMessageStatusDto) {
    const message = await this.prisma.contactMessage.findFirst({
      where: { id, user_id: userId },
    });

    if (!message) {
      throw new NotFoundException(`Contact message with ID "${id}" not found.`);
    }

    return this.prisma.contactMessage.update({
      where: { id },
      data: {
        is_read: dto.is_read,
      },
    });
  }

  /**
   * Delete a specific contact message
   */
  async delete(userId: string, id: string) {
    const message = await this.prisma.contactMessage.findFirst({
      where: { id, user_id: userId },
    });

    if (!message) {
      throw new NotFoundException(`Contact message with ID "${id}" not found.`);
    }

    return this.prisma.contactMessage.delete({
      where: { id },
    });
  }
}
