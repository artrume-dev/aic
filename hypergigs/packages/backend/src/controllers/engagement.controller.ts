import { Request, Response } from 'express';
import { engagementService } from '../services/engagement.service.js';
import { logger } from '../utils/logger.js';

/**
 * Get all engagements for a consulting firm
 */
export const getFirmEngagements = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firmId } = req.params;

    const engagements = await engagementService.getEngagementsByFirmId(firmId);

    res.status(200).json({ engagements });
  } catch (error) {
    logger.error('Get firm engagements error:', error);

    if (error instanceof Error) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to get engagements' });
    }
  }
};

/**
 * Get all engagements for a client
 */
export const getClientEngagements = async (req: Request, res: Response): Promise<void> => {
  try {
    const { clientId } = req.params;

    const engagements = await engagementService.getEngagementsByClientId(clientId);

    res.status(200).json({ engagements });
  } catch (error) {
    logger.error('Get client engagements error:', error);

    if (error instanceof Error) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to get engagements' });
    }
  }
};

/**
 * Get a single engagement by ID
 */
export const getEngagementById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { engagementId } = req.params;

    const engagement = await engagementService.getEngagementById(engagementId);

    res.status(200).json({ engagement });
  } catch (error) {
    logger.error('Get engagement by ID error:', error);

    if (error instanceof Error) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to get engagement' });
    }
  }
};

/**
 * Create a new engagement
 */
export const createEngagement = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const {
      title,
      description,
      clientName,
      consultingFirmId,
      clientId,
      status,
      pricingModel,
      totalValue,
      currency,
      deliveryModel,
      startDate,
      endDate,
      duration,
      platformFeePercent,
      milestones,
    } = req.body;

    // Validation
    if (!title || !consultingFirmId || !pricingModel) {
      res.status(400).json({ error: 'Title, consulting firm ID, and pricing model are required' });
      return;
    }

    // TODO: Verify user is admin/member of the consulting firm
    // For now, we'll allow any authenticated user (add team membership check later)

    const engagement = await engagementService.createEngagement({
      title,
      description,
      clientName,
      consultingFirmId,
      clientId,
      status,
      pricingModel,
      totalValue: totalValue ? parseFloat(totalValue) : undefined,
      currency,
      deliveryModel,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      duration: duration ? parseInt(duration) : undefined,
      platformFeePercent: platformFeePercent ? parseFloat(platformFeePercent) : undefined,
      milestones,
    });

    res.status(201).json({ engagement });
  } catch (error) {
    logger.error('Create engagement error:', error);

    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to create engagement' });
    }
  }
};

/**
 * Update an engagement
 */
export const updateEngagement = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { engagementId } = req.params;
    const { firmId } = req.body;

    if (!firmId) {
      res.status(400).json({ error: 'Consulting firm ID is required' });
      return;
    }

    // TODO: Verify user is admin/member of the consulting firm

    const {
      title,
      description,
      clientName,
      clientId,
      status,
      pricingModel,
      totalValue,
      currency,
      deliveryModel,
      startDate,
      endDate,
      duration,
      platformFeePercent,
      platformFeeAmount,
      platformFeePaid,
      milestones,
    } = req.body;

    const engagement = await engagementService.updateEngagement(engagementId, firmId, {
      title,
      description,
      clientName,
      clientId,
      status,
      pricingModel,
      totalValue: totalValue !== undefined ? parseFloat(totalValue) : undefined,
      currency,
      deliveryModel,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      duration: duration !== undefined ? parseInt(duration) : undefined,
      platformFeePercent: platformFeePercent !== undefined ? parseFloat(platformFeePercent) : undefined,
      platformFeeAmount: platformFeeAmount !== undefined ? parseFloat(platformFeeAmount) : undefined,
      platformFeePaid,
      milestones,
    });

    res.status(200).json({ engagement });
  } catch (error) {
    logger.error('Update engagement error:', error);

    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to update engagement' });
    }
  }
};

/**
 * Delete an engagement
 */
export const deleteEngagement = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { engagementId } = req.params;
    const { firmId } = req.body;

    if (!firmId) {
      res.status(400).json({ error: 'Consulting firm ID is required' });
      return;
    }

    // TODO: Verify user is admin of the consulting firm

    await engagementService.deleteEngagement(engagementId, firmId);

    res.status(200).json({ message: 'Engagement deleted successfully' });
  } catch (error) {
    logger.error('Delete engagement error:', error);

    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to delete engagement' });
    }
  }
};

/**
 * Search engagements with filters
 */
export const searchEngagements = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      consultingFirmId,
      clientId,
      status,
      pricingModel,
      startDateFrom,
      startDateTo,
      limit,
      offset,
    } = req.query;

    const engagements = await engagementService.searchEngagements({
      consultingFirmId: consultingFirmId as string,
      clientId: clientId as string,
      status: status as string,
      pricingModel: pricingModel as string,
      startDateFrom: startDateFrom ? new Date(startDateFrom as string) : undefined,
      startDateTo: startDateTo ? new Date(startDateTo as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      offset: offset ? parseInt(offset as string) : undefined,
    });

    res.status(200).json({ engagements });
  } catch (error) {
    logger.error('Search engagements error:', error);

    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to search engagements' });
    }
  }
};

/**
 * Get engagement stats for a consulting firm
 */
export const getEngagementStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firmId } = req.params;

    const stats = await engagementService.getEngagementStats(firmId);

    res.status(200).json({ stats });
  } catch (error) {
    logger.error('Get engagement stats error:', error);

    if (error instanceof Error) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to get engagement stats' });
    }
  }
};

/**
 * Update milestone status
 */
export const updateMilestone = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { engagementId, milestoneId } = req.params;
    const { firmId, status, paidDate } = req.body;

    if (!firmId || !status) {
      res.status(400).json({ error: 'Firm ID and status are required' });
      return;
    }

    // TODO: Verify user is admin/member of the consulting firm

    const engagement = await engagementService.updateMilestone(
      engagementId,
      firmId,
      milestoneId,
      status,
      paidDate ? new Date(paidDate) : undefined
    );

    res.status(200).json({ engagement });
  } catch (error) {
    logger.error('Update milestone error:', error);

    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to update milestone' });
    }
  }
};
