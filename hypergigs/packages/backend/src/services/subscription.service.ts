import { prisma } from '../lib/prisma.js';
import { logger } from '../utils/logger.js';

export interface CreateSubscriptionData {
  subscriberId: string;
  subscriberType: string;
  plan: string;
  status?: string;
  amount: number;
  currency?: string;
  interval?: string;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
}

export interface UpdateSubscriptionData {
  plan?: string;
  status?: string;
  amount?: number;
  currency?: string;
  interval?: string;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  cancelAt?: Date;
  cancelledAt?: Date;
}

export interface SearchSubscriptionsFilters {
  subscriberId?: string;
  subscriberType?: string;
  plan?: string;
  status?: string;
  limit?: number;
  offset?: number;
}

export class SubscriptionService {
  /**
   * Get subscription by ID
   */
  async getSubscriptionById(subscriptionId: string) {
    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!subscription) {
      throw new Error('Subscription not found');
    }

    return subscription;
  }

  /**
   * Get active subscription for a subscriber
   */
  async getActiveSubscription(subscriberId: string) {
    const subscription = await prisma.subscription.findFirst({
      where: {
        subscriberId,
        status: 'ACTIVE',
      },
      orderBy: { createdAt: 'desc' },
    });

    return subscription;
  }

  /**
   * Get all subscriptions for a subscriber
   */
  async getSubscriptionsBySubscriberId(subscriberId: string) {
    const subscriptions = await prisma.subscription.findMany({
      where: { subscriberId },
      orderBy: { createdAt: 'desc' },
    });

    logger.info(`Retrieved ${subscriptions.length} subscriptions for subscriber ${subscriberId}`);
    return subscriptions;
  }

  /**
   * Create a new subscription
   */
  async createSubscription(data: CreateSubscriptionData) {
    // Validation: Check if subscriber exists
    if (data.subscriberType === 'USER') {
      const user = await prisma.user.findUnique({
        where: { id: data.subscriberId },
        select: { id: true },
      });

      if (!user) {
        throw new Error('User subscriber not found');
      }
    } else if (data.subscriberType === 'TEAM') {
      const team = await prisma.team.findUnique({
        where: { id: data.subscriberId },
        select: { id: true },
      });

      if (!team) {
        throw new Error('Team subscriber not found');
      }
    } else {
      throw new Error('Invalid subscriber type (must be USER or TEAM)');
    }

    // Validation: currentPeriodStart should be before currentPeriodEnd
    if (data.currentPeriodStart >= data.currentPeriodEnd) {
      throw new Error('Current period start must be before current period end');
    }

    // Validation: Check if subscriber already has an active subscription
    const existingActiveSubscription = await prisma.subscription.findFirst({
      where: {
        subscriberId: data.subscriberId,
        status: 'ACTIVE',
      },
    });

    if (existingActiveSubscription) {
      throw new Error('Subscriber already has an active subscription. Cancel or upgrade the existing one first.');
    }

    const subscription = await prisma.subscription.create({
      data: {
        ...data,
        status: data.status || 'ACTIVE',
        currency: data.currency || 'USD',
        interval: data.interval || 'MONTH',
      },
    });

    logger.info(`Subscription created: ${subscription.id} for ${data.subscriberType} ${data.subscriberId}`);
    return subscription;
  }

  /**
   * Update a subscription
   */
  async updateSubscription(subscriptionId: string, data: UpdateSubscriptionData) {
    // Verify subscription exists
    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!subscription) {
      throw new Error('Subscription not found');
    }

    // Validation: currentPeriodStart should be before currentPeriodEnd
    const currentPeriodStart = data.currentPeriodStart || subscription.currentPeriodStart;
    const currentPeriodEnd = data.currentPeriodEnd || subscription.currentPeriodEnd;
    if (currentPeriodStart >= currentPeriodEnd) {
      throw new Error('Current period start must be before current period end');
    }

    const updatedSubscription = await prisma.subscription.update({
      where: { id: subscriptionId },
      data,
    });

    logger.info(`Subscription updated: ${subscriptionId}`);
    return updatedSubscription;
  }

  /**
   * Cancel a subscription
   */
  async cancelSubscription(subscriptionId: string, cancelAt?: Date) {
    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!subscription) {
      throw new Error('Subscription not found');
    }

    if (subscription.status === 'CANCELLED') {
      throw new Error('Subscription already cancelled');
    }

    const updatedSubscription = await prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        status: 'CANCELLED',
        cancelAt: cancelAt || new Date(),
        cancelledAt: new Date(),
      },
    });

    logger.info(`Subscription cancelled: ${subscriptionId}`);
    return updatedSubscription;
  }

  /**
   * Renew a subscription (extend period)
   */
  async renewSubscription(subscriptionId: string) {
    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!subscription) {
      throw new Error('Subscription not found');
    }

    if (subscription.status !== 'ACTIVE') {
      throw new Error('Can only renew active subscriptions');
    }

    // Calculate new period based on interval
    const newPeriodStart = subscription.currentPeriodEnd;
    let newPeriodEnd: Date;

    if (subscription.interval === 'MONTH') {
      newPeriodEnd = new Date(newPeriodStart);
      newPeriodEnd.setMonth(newPeriodEnd.getMonth() + 1);
    } else if (subscription.interval === 'YEAR') {
      newPeriodEnd = new Date(newPeriodStart);
      newPeriodEnd.setFullYear(newPeriodEnd.getFullYear() + 1);
    } else {
      throw new Error('Invalid subscription interval');
    }

    const renewedSubscription = await prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        currentPeriodStart: newPeriodStart,
        currentPeriodEnd: newPeriodEnd,
      },
    });

    logger.info(`Subscription renewed: ${subscriptionId}`);
    return renewedSubscription;
  }

  /**
   * Upgrade/downgrade subscription plan
   */
  async changeSubscriptionPlan(subscriptionId: string, newPlan: string, newAmount: number) {
    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!subscription) {
      throw new Error('Subscription not found');
    }

    if (subscription.status !== 'ACTIVE') {
      throw new Error('Can only change plan for active subscriptions');
    }

    const updatedSubscription = await prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        plan: newPlan,
        amount: newAmount,
      },
    });

    logger.info(`Subscription plan changed: ${subscriptionId} to ${newPlan}`);
    return updatedSubscription;
  }

  /**
   * Search subscriptions with filters
   */
  async searchSubscriptions(filters: SearchSubscriptionsFilters) {
    const where: any = {};

    if (filters.subscriberId) {
      where.subscriberId = filters.subscriberId;
    }

    if (filters.subscriberType) {
      where.subscriberType = filters.subscriberType;
    }

    if (filters.plan) {
      where.plan = filters.plan;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    const subscriptions = await prisma.subscription.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: filters.limit || 20,
      skip: filters.offset || 0,
    });

    return subscriptions;
  }

  /**
   * Get subscription stats (for admin dashboard)
   */
  async getSubscriptionStats(filters?: { subscriberType?: string }) {
    const where: any = {};

    if (filters?.subscriberType) {
      where.subscriberType = filters.subscriberType;
    }

    const subscriptions = await prisma.subscription.findMany({
      where,
      select: {
        plan: true,
        status: true,
        amount: true,
        interval: true,
      },
    });

    const stats = {
      total: subscriptions.length,
      byPlan: {} as Record<string, number>,
      byStatus: {} as Record<string, number>,
      byInterval: {} as Record<string, number>,
      totalRevenue: 0,
      activeSubscriptions: 0,
      cancelledSubscriptions: 0,
    };

    subscriptions.forEach(subscription => {
      // Count by plan
      stats.byPlan[subscription.plan] = (stats.byPlan[subscription.plan] || 0) + 1;

      // Count by status
      stats.byStatus[subscription.status] = (stats.byStatus[subscription.status] || 0) + 1;

      // Count by interval
      stats.byInterval[subscription.interval] = (stats.byInterval[subscription.interval] || 0) + 1;

      // Calculate revenue (only active subscriptions)
      if (subscription.status === 'ACTIVE') {
        stats.totalRevenue += subscription.amount;
        stats.activeSubscriptions++;
      }

      if (subscription.status === 'CANCELLED') {
        stats.cancelledSubscriptions++;
      }
    });

    return stats;
  }

  /**
   * Check for expiring subscriptions (for cron job)
   */
  async getExpiringSubscriptions(daysBeforeExpiry: number = 7) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysBeforeExpiry);

    const subscriptions = await prisma.subscription.findMany({
      where: {
        status: 'ACTIVE',
        currentPeriodEnd: {
          lte: targetDate,
          gte: new Date(),
        },
      },
      orderBy: { currentPeriodEnd: 'asc' },
    });

    logger.info(`Found ${subscriptions.length} subscriptions expiring within ${daysBeforeExpiry} days`);
    return subscriptions;
  }

  /**
   * Mark expired subscriptions as inactive (for cron job)
   */
  async markExpiredSubscriptions() {
    const now = new Date();

    const result = await prisma.subscription.updateMany({
      where: {
        status: 'ACTIVE',
        currentPeriodEnd: {
          lt: now,
        },
      },
      data: {
        status: 'EXPIRED',
      },
    });

    logger.info(`Marked ${result.count} subscriptions as expired`);
    return result.count;
  }
}

export const subscriptionService = new SubscriptionService();
