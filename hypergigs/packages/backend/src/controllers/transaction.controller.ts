import { Request, Response } from 'express';
import { transactionService } from '../services/transaction.service.js';
import { logger } from '../utils/logger.js';

/**
 * Get transaction by ID
 */
export const getTransactionById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { transactionId } = req.params;

    const transaction = await transactionService.getTransactionById(transactionId);

    res.status(200).json({ transaction });
  } catch (error) {
    logger.error('Get transaction by ID error:', error);

    if (error instanceof Error) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to get transaction' });
    }
  }
};

/**
 * Get transactions for payer
 */
export const getPayerTransactions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { payerId } = req.params;

    const transactions = await transactionService.getTransactionsByPayerId(payerId);

    res.status(200).json({ transactions });
  } catch (error) {
    logger.error('Get payer transactions error:', error);

    if (error instanceof Error) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to get transactions' });
    }
  }
};

/**
 * Get transactions for payee
 */
export const getPayeeTransactions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { payeeId } = req.params;

    const transactions = await transactionService.getTransactionsByPayeeId(payeeId);

    res.status(200).json({ transactions });
  } catch (error) {
    logger.error('Get payee transactions error:', error);

    if (error instanceof Error) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to get transactions' });
    }
  }
};

/**
 * Get transactions for engagement
 */
export const getEngagementTransactions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { engagementId } = req.params;

    const transactions = await transactionService.getTransactionsByEngagementId(engagementId);

    res.status(200).json({ transactions });
  } catch (error) {
    logger.error('Get engagement transactions error:', error);

    if (error instanceof Error) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to get transactions' });
    }
  }
};

/**
 * Get transactions for job application
 */
export const getJobApplicationTransactions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { jobApplicationId } = req.params;

    const transactions = await transactionService.getTransactionsByJobApplicationId(jobApplicationId);

    res.status(200).json({ transactions });
  } catch (error) {
    logger.error('Get job application transactions error:', error);

    if (error instanceof Error) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to get transactions' });
    }
  }
};

/**
 * Create a new transaction
 */
export const createTransaction = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const {
      type,
      category,
      payerId,
      payeeId,
      amount,
      currency,
      platformFee,
      payoutAmount,
      engagementId,
      jobApplicationId,
      paymentMethod,
      stripePaymentId,
      status,
      description,
      metadata,
    } = req.body;

    // Validation
    if (!type || !category || !amount) {
      res.status(400).json({ error: 'Type, category, and amount are required' });
      return;
    }

    // TODO: Add authorization check - only admins or involved parties can create transactions

    const transaction = await transactionService.createTransaction({
      type,
      category,
      payerId,
      payeeId,
      amount: parseFloat(amount),
      currency,
      platformFee: platformFee ? parseFloat(platformFee) : undefined,
      payoutAmount: payoutAmount ? parseFloat(payoutAmount) : undefined,
      engagementId,
      jobApplicationId,
      paymentMethod,
      stripePaymentId,
      status,
      description,
      metadata,
    });

    res.status(201).json({ transaction });
  } catch (error) {
    logger.error('Create transaction error:', error);

    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to create transaction' });
    }
  }
};

/**
 * Update a transaction
 */
export const updateTransaction = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { transactionId } = req.params;
    const { status, stripePaymentId, paymentMethod, description, metadata, completedAt } = req.body;

    // TODO: Add authorization check - only admins can update transactions

    const transaction = await transactionService.updateTransaction(transactionId, {
      status,
      stripePaymentId,
      paymentMethod,
      description,
      metadata,
      completedAt: completedAt ? new Date(completedAt) : undefined,
    });

    res.status(200).json({ transaction });
  } catch (error) {
    logger.error('Update transaction error:', error);

    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to update transaction' });
    }
  }
};

/**
 * Mark transaction as completed
 */
export const completeTransaction = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { transactionId } = req.params;
    const { stripePaymentId } = req.body;

    // TODO: Add authorization check - only admins or payment service can complete transactions

    const transaction = await transactionService.completeTransaction(transactionId, stripePaymentId);

    res.status(200).json({ transaction });
  } catch (error) {
    logger.error('Complete transaction error:', error);

    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to complete transaction' });
    }
  }
};

/**
 * Mark transaction as failed
 */
export const failTransaction = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { transactionId } = req.params;
    const { reason } = req.body;

    // TODO: Add authorization check - only admins or payment service can fail transactions

    const transaction = await transactionService.failTransaction(transactionId, reason);

    res.status(200).json({ transaction });
  } catch (error) {
    logger.error('Fail transaction error:', error);

    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to mark transaction as failed' });
    }
  }
};

/**
 * Search transactions with filters
 */
export const searchTransactions = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      type,
      category,
      payerId,
      payeeId,
      status,
      engagementId,
      jobApplicationId,
      dateFrom,
      dateTo,
      limit,
      offset,
    } = req.query;

    const transactions = await transactionService.searchTransactions({
      type: type as string,
      category: category as string,
      payerId: payerId as string,
      payeeId: payeeId as string,
      status: status as string,
      engagementId: engagementId as string,
      jobApplicationId: jobApplicationId as string,
      dateFrom: dateFrom ? new Date(dateFrom as string) : undefined,
      dateTo: dateTo ? new Date(dateTo as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      offset: offset ? parseInt(offset as string) : undefined,
    });

    res.status(200).json({ transactions });
  } catch (error) {
    logger.error('Search transactions error:', error);

    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to search transactions' });
    }
  }
};

/**
 * Get transaction stats (admin only)
 */
export const getTransactionStats = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    // TODO: Add authorization check - only admins can view stats

    const { dateFrom, dateTo } = req.query;

    const stats = await transactionService.getTransactionStats({
      dateFrom: dateFrom ? new Date(dateFrom as string) : undefined,
      dateTo: dateTo ? new Date(dateTo as string) : undefined,
    });

    res.status(200).json({ stats });
  } catch (error) {
    logger.error('Get transaction stats error:', error);

    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to get transaction stats' });
    }
  }
};
