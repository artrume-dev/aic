import { prisma } from '../lib/prisma.js';
import { logger } from '../utils/logger.js';

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  amount: number;
  dueDate?: Date;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'PAID';
  paidDate?: Date;
}

export interface CreateEngagementData {
  title: string;
  description?: string;
  clientName?: string;
  consultingFirmId: string;
  clientId?: string;
  status?: string;
  pricingModel: string;
  totalValue?: number;
  currency?: string;
  deliveryModel?: string;
  startDate?: Date;
  endDate?: Date;
  duration?: number;
  platformFeePercent?: number;
  milestones?: Milestone[];
}

export interface UpdateEngagementData {
  title?: string;
  description?: string;
  clientName?: string;
  clientId?: string;
  status?: string;
  pricingModel?: string;
  totalValue?: number;
  currency?: string;
  deliveryModel?: string;
  startDate?: Date;
  endDate?: Date;
  duration?: number;
  platformFeePercent?: number;
  platformFeeAmount?: number;
  platformFeePaid?: boolean;
  milestones?: Milestone[];
}

export interface SearchEngagementsFilters {
  consultingFirmId?: string;
  clientId?: string;
  status?: string;
  pricingModel?: string;
  startDateFrom?: Date;
  startDateTo?: Date;
  limit?: number;
  offset?: number;
}

export class EngagementService {
  /**
   * Get all engagements for a consulting firm
   */
  async getEngagementsByFirmId(firmId: string) {
    const engagements = await prisma.engagement.findMany({
      where: { consultingFirmId: firmId },
      orderBy: { createdAt: 'desc' },
    });

    // Parse milestones JSON
    const engagementsWithParsedMilestones = engagements.map(engagement => ({
      ...engagement,
      milestones: engagement.milestones ? JSON.parse(engagement.milestones) : [],
    }));

    logger.info(`Retrieved ${engagements.length} engagements for firm ${firmId}`);
    return engagementsWithParsedMilestones;
  }

  /**
   * Get all engagements for a client
   */
  async getEngagementsByClientId(clientId: string) {
    const engagements = await prisma.engagement.findMany({
      where: { clientId },
      orderBy: { createdAt: 'desc' },
    });

    // Parse milestones JSON
    const engagementsWithParsedMilestones = engagements.map(engagement => ({
      ...engagement,
      milestones: engagement.milestones ? JSON.parse(engagement.milestones) : [],
    }));

    logger.info(`Retrieved ${engagements.length} engagements for client ${clientId}`);
    return engagementsWithParsedMilestones;
  }

  /**
   * Get a single engagement by ID
   */
  async getEngagementById(engagementId: string) {
    const engagement = await prisma.engagement.findUnique({
      where: { id: engagementId },
    });

    if (!engagement) {
      throw new Error('Engagement not found');
    }

    // Parse milestones JSON
    return {
      ...engagement,
      milestones: engagement.milestones ? JSON.parse(engagement.milestones) : [],
    };
  }

  /**
   * Create a new engagement
   */
  async createEngagement(data: CreateEngagementData) {
    // Validation: Check if consulting firm exists
    const firm = await prisma.team.findUnique({
      where: { id: data.consultingFirmId },
      select: { id: true, isConsultingFirm: true },
    });

    if (!firm) {
      throw new Error('Consulting firm not found');
    }

    if (!firm.isConsultingFirm) {
      throw new Error('Team is not registered as a consulting firm');
    }

    // Validation: If clientId provided, check if user exists
    if (data.clientId) {
      const client = await prisma.user.findUnique({
        where: { id: data.clientId },
        select: { id: true },
      });

      if (!client) {
        throw new Error('Client user not found');
      }
    }

    // Validation: startDate should be before endDate
    if (data.startDate && data.endDate && data.startDate > data.endDate) {
      throw new Error('Start date must be before end date');
    }

    // Calculate platform fee amount if totalValue is provided
    const platformFeeAmount = data.totalValue && data.platformFeePercent
      ? (data.totalValue * data.platformFeePercent) / 100
      : undefined;

    const engagement = await prisma.engagement.create({
      data: {
        ...data,
        status: data.status || 'PROPOSAL',
        currency: data.currency || 'USD',
        platformFeePercent: data.platformFeePercent || 22.5,
        platformFeeAmount,
        milestones: data.milestones ? JSON.stringify(data.milestones) : '[]',
      },
    });

    logger.info(`Engagement created: ${engagement.id} for firm ${data.consultingFirmId}`);

    // Parse milestones for response
    return {
      ...engagement,
      milestones: engagement.milestones ? JSON.parse(engagement.milestones) : [],
    };
  }

  /**
   * Update an engagement
   */
  async updateEngagement(engagementId: string, firmId: string, data: UpdateEngagementData) {
    // Verify ownership
    const engagement = await prisma.engagement.findFirst({
      where: {
        id: engagementId,
        consultingFirmId: firmId,
      },
    });

    if (!engagement) {
      throw new Error('Engagement not found or unauthorized');
    }

    // Validation: startDate should be before endDate
    const startDate = data.startDate || engagement.startDate;
    const endDate = data.endDate || engagement.endDate;
    if (startDate && endDate && startDate > endDate) {
      throw new Error('Start date must be before end date');
    }

    // Recalculate platform fee amount if totalValue or platformFeePercent changed
    let platformFeeAmount = data.platformFeeAmount;
    if (data.totalValue !== undefined || data.platformFeePercent !== undefined) {
      const totalValue = data.totalValue ?? engagement.totalValue;
      const platformFeePercent = data.platformFeePercent ?? engagement.platformFeePercent;

      if (totalValue && platformFeePercent) {
        platformFeeAmount = (totalValue * platformFeePercent) / 100;
      }
    }

    const updatedEngagement = await prisma.engagement.update({
      where: { id: engagementId },
      data: {
        ...data,
        platformFeeAmount,
        milestones: data.milestones ? JSON.stringify(data.milestones) : undefined,
      },
    });

    logger.info(`Engagement updated: ${engagementId}`);

    // Parse milestones for response
    return {
      ...updatedEngagement,
      milestones: updatedEngagement.milestones ? JSON.parse(updatedEngagement.milestones) : [],
    };
  }

  /**
   * Delete an engagement
   */
  async deleteEngagement(engagementId: string, firmId: string) {
    // Verify ownership
    const engagement = await prisma.engagement.findFirst({
      where: {
        id: engagementId,
        consultingFirmId: firmId,
      },
    });

    if (!engagement) {
      throw new Error('Engagement not found or unauthorized');
    }

    // Check if engagement can be deleted (not ACTIVE or has transactions)
    if (engagement.status === 'ACTIVE') {
      throw new Error('Cannot delete active engagement. Please cancel it first.');
    }

    const transactions = await prisma.transaction.count({
      where: { engagementId },
    });

    if (transactions > 0) {
      throw new Error('Cannot delete engagement with existing transactions');
    }

    await prisma.engagement.delete({
      where: { id: engagementId },
    });

    logger.info(`Engagement deleted: ${engagementId}`);
    return { success: true };
  }

  /**
   * Search engagements with filters
   */
  async searchEngagements(filters: SearchEngagementsFilters) {
    const where: any = {};

    if (filters.consultingFirmId) {
      where.consultingFirmId = filters.consultingFirmId;
    }

    if (filters.clientId) {
      where.clientId = filters.clientId;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.pricingModel) {
      where.pricingModel = filters.pricingModel;
    }

    if (filters.startDateFrom || filters.startDateTo) {
      where.startDate = {};
      if (filters.startDateFrom) {
        where.startDate.gte = filters.startDateFrom;
      }
      if (filters.startDateTo) {
        where.startDate.lte = filters.startDateTo;
      }
    }

    const engagements = await prisma.engagement.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: filters.limit || 20,
      skip: filters.offset || 0,
    });

    // Parse milestones JSON
    const engagementsWithParsedMilestones = engagements.map(engagement => ({
      ...engagement,
      milestones: engagement.milestones ? JSON.parse(engagement.milestones) : [],
    }));

    return engagementsWithParsedMilestones;
  }

  /**
   * Get engagement stats for a consulting firm
   */
  async getEngagementStats(firmId: string) {
    const engagements = await prisma.engagement.findMany({
      where: { consultingFirmId: firmId },
      select: {
        status: true,
        totalValue: true,
        platformFeeAmount: true,
        platformFeePaid: true,
      },
    });

    const stats = {
      total: engagements.length,
      byStatus: {
        PROPOSAL: 0,
        ACTIVE: 0,
        COMPLETED: 0,
        CANCELLED: 0,
      },
      totalValue: 0,
      totalPlatformFees: 0,
      unpaidPlatformFees: 0,
    };

    engagements.forEach(engagement => {
      // Count by status
      if (engagement.status in stats.byStatus) {
        stats.byStatus[engagement.status as keyof typeof stats.byStatus]++;
      }

      // Sum total values
      if (engagement.totalValue) {
        stats.totalValue += engagement.totalValue;
      }

      // Sum platform fees
      if (engagement.platformFeeAmount) {
        stats.totalPlatformFees += engagement.platformFeeAmount;
        if (!engagement.platformFeePaid) {
          stats.unpaidPlatformFees += engagement.platformFeeAmount;
        }
      }
    });

    return stats;
  }

  /**
   * Update milestone status
   */
  async updateMilestone(engagementId: string, firmId: string, milestoneId: string, status: string, paidDate?: Date) {
    // Verify ownership
    const engagement = await prisma.engagement.findFirst({
      where: {
        id: engagementId,
        consultingFirmId: firmId,
      },
    });

    if (!engagement) {
      throw new Error('Engagement not found or unauthorized');
    }

    // Parse milestones
    const milestones: Milestone[] = engagement.milestones ? JSON.parse(engagement.milestones) : [];

    // Find and update milestone
    const milestoneIndex = milestones.findIndex(m => m.id === milestoneId);
    if (milestoneIndex === -1) {
      throw new Error('Milestone not found');
    }

    milestones[milestoneIndex] = {
      ...milestones[milestoneIndex],
      status: status as any,
      paidDate,
    };

    // Update engagement
    const updatedEngagement = await prisma.engagement.update({
      where: { id: engagementId },
      data: {
        milestones: JSON.stringify(milestones),
      },
    });

    logger.info(`Milestone ${milestoneId} updated in engagement ${engagementId}`);

    return {
      ...updatedEngagement,
      milestones,
    };
  }
}

export const engagementService = new EngagementService();
