import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LogPageViewDto } from './dto/log-pageview.dto';

@Injectable()
export class PageViewsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Log a page view for a user (by username)
   */
  async logView(
    username: string,
    dto: LogPageViewDto,
    fallbackIp?: string,
    fallbackUserAgent?: string,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      throw new NotFoundException(`User with username "${username}" not found.`);
    }

    const device = dto.device || fallbackUserAgent || 'Unknown';
    const ipAddress = dto.ip_address || fallbackIp || null;

    return this.prisma.pageView.create({
      data: {
        user_id: user.id,
        ip_address: ipAddress,
        referrer: dto.referrer || null,
        device: device.substring(0, 100),
        country: dto.country || 'Unknown',
      },
    });
  }

  /**
   * Get page view statistics/history for the user
   */
  async getStatsForUser(userId: string) {
    const totalViews = await this.prisma.pageView.count({
      where: { user_id: userId },
    });

    const countryStats = await this.prisma.pageView.groupBy({
      by: ['country'],
      where: { user_id: userId },
      _count: {
        id: true,
      },
    });

    const deviceStats = await this.prisma.pageView.groupBy({
      by: ['device'],
      where: { user_id: userId },
      _count: {
        id: true,
      },
    });

    const recentLogs = await this.prisma.pageView.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
      take: 50,
    });

    return {
      total_views: totalViews,
      by_country: countryStats.map((item) => ({
        country: item.country,
        count: item._count.id,
      })),
      by_device: deviceStats.map((item) => ({
        device: item.device,
        count: item._count.id,
      })),
      recent_logs: recentLogs,
    };
  }
}
