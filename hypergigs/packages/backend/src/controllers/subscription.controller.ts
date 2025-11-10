import { Request, Response } from 'express';
import { subscriptionService } from '../services/subscription.service.js';
import { logger } from '../utils/logger.js';

/**
 * Get subscription by ID
 */
export const getSubscriptionById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { subscriptionId } = req.params;

    const subscription = await subscriptionService.getSubscriptionById(subscriptionId);

    res.status(200).json({ subscription });
  } catch (error) {
    logger.error('Get subscription by ID error:', error);

    if (error instanceof Error) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to get subscription' });
    }
  }
};

/**
 * Get active subscription for a subscriber
 */
export const getActiveSubscription = async (req: Request, res: Response): Promise<void> => {
  try {
    const { subscriberId } = req.params;

    const subscription = await subscriptionService.getActiveSubscription(subscriberId);

    res.status(200).json({ subscription });
  } catch (error) {
    logger.error('Get active subscription error:', error);

    if (error instanceof Error) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to get active subscription' });
    }
  }
};

/**
 * Get all subscriptions for a subscriber
 */
export const getSubscriberSubscriptions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { subscriberId } = req.params;

    const subscriptions = await subscriptionService.getSubscriptionsBySubscriberId(subscriberId);

    res.status(200).json({ subscriptions });
  } catch (error) {
    logger.error('Get subscriber subscriptions error:', error);

    if (error instanceof Error) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to get subscriptions' });
    }
  }
};

/**
 * Create a new subscription
 */
export const createSubscription = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const {
      subscriberId,
      subscriberType,
      plan,
      status,
      amount,
      currency,
      interval,
      stripeSubscriptionId,
      stripeCustomerId,
      currentPeriodStart,
      currentPeriodEnd,
    } = req.body;

    // Validation
    if (!subscriberId || !subscriberType || !plan || !amount || !currentPeriodStart || !currentPeriodEnd) {
      res.status(400).json({
        error: 'Subscriber ID, type, plan, amount, and period dates are required',
      });
      return;
    }

    // TODO: Add authorization check - only subscriber or admin can create subscription

    const subscription = await subscriptionService.createSubscription({
      subscriberId,
      subscriberType,
      plan,
      status,
      amount: parseFloat(amount),
      currency,
      interval,
      stripeSubscriptionId,
      stripeCustomerId,
      currentPeriodStart: new Date(currentPeriodStart),
      currentPeriodEnd: new Date(currentPeriodEnd),
    });

    res.status(201).json({ subscription });
  } catch (error) {
    logger.error('Create subscription error:', error);

    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to create subscription' });
    }
  }
};

/**
 * Update a subscription
 */
export const updateSubscription = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { subscriptionId } = req.params;
    const {
      plan,
      status,
      amount,
      currency,
      interval,
      stripeSubscriptionId,
      stripeCustomerId,
      currentPeriodStart,
      currentPeriodEnd,
      cancelAt,
      cancelledAt,
    } = req.body;

    // TODO: Add authorization check - only subscriber or admin can update subscription

    const subscription = await subscriptionService.updateSubscription(subscriptionId, {
      plan,
      status,
      amount: amount !== undefined ? parseFloat(amount) : undefined,
      currency,
      interval,
      stripeSubscriptionId,
      stripeCustomerId,
      currentPeriodStart: currentPeriodStart ? new Date(currentPeriodStart) : undefined,
      currentPeriodEnd: currentPeriodEnd ? new Date(currentPeriodEnd) : undefined,
      cancelAt: cancelAt ? new Date(cancelAt) : undefined,
      cancelledAt: cancelledAt ? new Date(cancelledAt) : undefined,
    });

    res.status(200).json({ subscription });
  } catch (error) {
    logger.error('Update subscription error:', error);

    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to update subscription' });
    }
  }
};

/**
 * Cancel a subscription
 */
export const cancelSubscription = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { subscriptionId } = req.params;
    const { cancelAt } = req.body;

    // TODO: Add authorization check - only subscriber or admin can cancel subscription

    const subscription = await subscriptionService.cancelSubscription(
      subscriptionId,
      cancelAt ? new Date(cancelAt) : undefined
    );

    res.status(200).json({ subscription });
  } catch (error) {
    logger.error('Cancel subscription error:', error);

    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to cancel subscription' });
    }
  }
};

/**
 * Renew a subscription
 */
export const renewSubscription = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { subscriptionId } = req.params;

    // TODO: Add authorization check - only subscriber or admin can renew subscription

    const subscription = await subscriptionService.renewSubscription(subscriptionId);

    res.status(200).json({ subscription });
  } catch (error) {
    logger.error('Renew subscription error:', error);

    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to renew subscription' });
    }
  }
};

/**
 * Change subscription plan
 */
export const changeSubscriptionPlan = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { subscriptionId } = req.params;
    const { newPlan, newAmount } = req.body;

    if (!newPlan || !newAmount) {
      res.status(400).json({ error: 'New plan and amount are required' });
      return;
    }

    // TODO: Add authorization check - only subscriber or admin can change plan

    const subscription = await subscriptionService.changeSubscriptionPlan(
      subscriptionId,
      newPlan,
      parseFloat(newAmount)
    );

    res.status(200).json({ subscription });
  } catch (error) {
    logger.error('Change subscription plan error:', error);

    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to change subscription plan' });
    }
  }
};

/**
 * Search subscriptions with filters
 */
export const searchSubscriptions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { subscriberId, subscriberType, plan, status, limit, offset } = req.query;

    const subscriptions = await subscriptionService.searchSubscriptions({
      subscriberId: subscriberId as string,
      subscriberType: subscriberType as string,
      plan: plan as string,
      status: status as string,
      limit: limit ? parseInt(limit as string) : undefined,
      offset: offset ? parseInt(offset as string) : undefined,
    });

    res.status(200).json({ subscriptions });
  } catch (error) {
    logger.error('Search subscriptions error:', error);

    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to search subscriptions' });
    }
  }
};

/**
 * Get subscription stats (admin only)
 */
export const getSubscriptionStats = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    // TODO: Add authorization check - only admins can view stats

    const { subscriberType } = req.query;

    const stats = await subscriptionService.getSubscriptionStats({
      subscriberType: subscriberType as string,
    });

    res.status(200).json({ stats });
  } catch (error) {
    logger.error('Get subscription stats error:', error);

    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to get subscription stats' });
    }
  }
};

/**
 * Get expiring subscriptions (admin/system)
 */
export const getExpiringSubscriptions = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    // TODO: Add authorization check - only admins can view expiring subscriptions

    const { days } = req.query;
    const daysBeforeExpiry = days ? parseInt(days as string) : 7;

    const subscriptions = await subscriptionService.getExpiringSubscriptions(daysBeforeExpiry);

    res.status(200).json({ subscriptions });
  } catch (error) {
    logger.error('Get expiring subscriptions error:', error);

    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to get expiring subscriptions' });
    }
  }
};
