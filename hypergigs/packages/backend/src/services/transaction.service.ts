import { prisma } from '../lib/prisma.js';
import { logger } from '../utils/logger.js';

export interface CreateTransactionData {
  type: string;
  category: string;
  payerId?: string;
  payeeId?: string;
  amount: number;
  currency?: string;
  platformFee?: number;
  payoutAmount?: number;
  engagementId?: string;
  jobApplicationId?: string;
  paymentMethod?: string;
  stripePaymentId?: string;
  status?: string;
  description?: string;
  metadata?: any;
}

export interface UpdateTransactionData {
  status?: string;
  stripePaymentId?: string;
  paymentMethod?: string;
  description?: string;
  metadata?: any;
  completedAt?: Date;
}

export interface SearchTransactionsFilters {
  type?: string;
  category?: string;
  payerId?: string;
  payeeId?: string;
  status?: string;
  engagementId?: string;
  jobApplicationId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  limit?: number;
  offset?: number;
}

export class TransactionService {
  /**
   * Get transaction by ID
   */
  async getTransactionById(transactionId: string) {
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    // Parse metadata JSON
    return {
      ...transaction,
      metadata: transaction.metadata ? JSON.parse(transaction.metadata) : {},
    };
  }

  /**
   * Get all transactions for a payer
   */
  async getTransactionsByPayerId(payerId: string) {
    const transactions = await prisma.transaction.findMany({
      where: { payerId },
      orderBy: { createdAt: 'desc' },
    });

    // Parse metadata JSON
    const transactionsWithParsedMetadata = transactions.map(transaction => ({
      ...transaction,
      metadata: transaction.metadata ? JSON.parse(transaction.metadata) : {},
    }));

    logger.info(`Retrieved ${transactions.length} transactions for payer ${payerId}`);
    return transactionsWithParsedMetadata;
  }

  /**
   * Get all transactions for a payee
   */
  async getTransactionsByPayeeId(payeeId: string) {
    const transactions = await prisma.transaction.findMany({
      where: { payeeId },
      orderBy: { createdAt: 'desc' },
    });

    // Parse metadata JSON
    const transactionsWithParsedMetadata = transactions.map(transaction => ({
      ...transaction,
      metadata: transaction.metadata ? JSON.parse(transaction.metadata) : {},
    }));

    logger.info(`Retrieved ${transactions.length} transactions for payee ${payeeId}`);
    return transactionsWithParsedMetadata;
  }

  /**
   * Get all transactions for an engagement
   */
  async getTransactionsByEngagementId(engagementId: string) {
    const transactions = await prisma.transaction.findMany({
      where: { engagementId },
      orderBy: { createdAt: 'desc' },
    });

    // Parse metadata JSON
    const transactionsWithParsedMetadata = transactions.map(transaction => ({
      ...transaction,
      metadata: transaction.metadata ? JSON.parse(transaction.metadata) : {},
    }));

    logger.info(`Retrieved ${transactions.length} transactions for engagement ${engagementId}`);
    return transactionsWithParsedMetadata;
  }

  /**
   * Get all transactions for a job application
   */
  async getTransactionsByJobApplicationId(jobApplicationId: string) {
    const transactions = await prisma.transaction.findMany({
      where: { jobApplicationId },
      orderBy: { createdAt: 'desc' },
    });

    // Parse metadata JSON
    const transactionsWithParsedMetadata = transactions.map(transaction => ({
      ...transaction,
      metadata: transaction.metadata ? JSON.parse(transaction.metadata) : {},
    }));

    logger.info(`Retrieved ${transactions.length} transactions for job application ${jobApplicationId}`);
    return transactionsWithParsedMetadata;
  }

  /**
   * Create a new transaction
   */
  async createTransaction(data: CreateTransactionData) {
    // Validation: Check if payer exists (if provided)
    if (data.payerId) {
      const payerUser = await prisma.user.findUnique({
        where: { id: data.payerId },
        select: { id: true },
      });

      const payerTeam = await prisma.team.findUnique({
        where: { id: data.payerId },
        select: { id: true },
      });

      if (!payerUser && !payerTeam) {
        throw new Error('Payer not found (must be valid User or Team ID)');
      }
    }

    // Validation: Check if payee exists (if provided)
    if (data.payeeId) {
      const payeeUser = await prisma.user.findUnique({
        where: { id: data.payeeId },
        select: { id: true },
      });

      const payeeTeam = await prisma.team.findUnique({
        where: { id: data.payeeId },
        select: { id: true },
      });

      if (!payeeUser && !payeeTeam) {
        throw new Error('Payee not found (must be valid User or Team ID)');
      }
    }

    // Validation: Check if engagement exists (if provided)
    if (data.engagementId) {
      const engagement = await prisma.engagement.findUnique({
        where: { id: data.engagementId },
        select: { id: true },
      });

      if (!engagement) {
        throw new Error('Engagement not found');
      }
    }

    // Validation: Check if job application exists (if provided)
    if (data.jobApplicationId) {
      const jobApplication = await prisma.jobApplication.findUnique({
        where: { id: data.jobApplicationId },
        select: { id: true },
      });

      if (!jobApplication) {
        throw new Error('Job application not found');
      }
    }

    // Validation: amount should be positive
    if (data.amount <= 0) {
      throw new Error('Amount must be greater than zero');
    }

    // Calculate payout amount if platform fee is provided
    const payoutAmount = data.platformFee !== undefined
      ? data.amount - data.platformFee
      : data.payoutAmount;

    const transaction = await prisma.transaction.create({
      data: {
        ...data,
        currency: data.currency || 'USD',
        status: data.status || 'PENDING',
        payoutAmount,
        metadata: data.metadata ? JSON.stringify(data.metadata) : '{}',
      },
    });

    logger.info(`Transaction created: ${transaction.id} (${data.type})`);

    // Parse metadata for response
    return {
      ...transaction,
      metadata: transaction.metadata ? JSON.parse(transaction.metadata) : {},
    };
  }

  /**
   * Update a transaction
   */
  async updateTransaction(transactionId: string, data: UpdateTransactionData) {
    // Verify transaction exists
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    // Validation: Cannot modify completed transactions
    if (transaction.status === 'COMPLETED' && data.status !== 'REFUNDED') {
      throw new Error('Cannot modify completed transaction (only refunds are allowed)');
    }

    const updatedTransaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        ...data,
        metadata: data.metadata ? JSON.stringify(data.metadata) : undefined,
      },
    });

    logger.info(`Transaction updated: ${transactionId}`);

    // Parse metadata for response
    return {
      ...updatedTransaction,
      metadata: updatedTransaction.metadata ? JSON.parse(updatedTransaction.metadata) : {},
    };
  }

  /**
   * Mark transaction as completed
   */
  async completeTransaction(transactionId: string, stripePaymentId?: string) {
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    if (transaction.status === 'COMPLETED') {
      throw new Error('Transaction already completed');
    }

    const updatedTransaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        stripePaymentId: stripePaymentId || transaction.stripePaymentId,
      },
    });

    logger.info(`Transaction completed: ${transactionId}`);

    return {
      ...updatedTransaction,
      metadata: updatedTransaction.metadata ? JSON.parse(updatedTransaction.metadata) : {},
    };
  }

  /**
   * Mark transaction as failed
   */
  async failTransaction(transactionId: string, reason?: string) {
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    // Parse existing metadata
    const metadata = transaction.metadata ? JSON.parse(transaction.metadata) : {};
    metadata.failureReason = reason;

    const updatedTransaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        status: 'FAILED',
        metadata: JSON.stringify(metadata),
      },
    });

    logger.info(`Transaction failed: ${transactionId} - ${reason}`);

    return {
      ...updatedTransaction,
      metadata,
    };
  }

  /**
   * Search transactions with filters
   */
  async searchTransactions(filters: SearchTransactionsFilters) {
    const where: any = {};

    if (filters.type) {
      where.type = filters.type;
    }

    if (filters.category) {
      where.category = filters.category;
    }

    if (filters.payerId) {
      where.payerId = filters.payerId;
    }

    if (filters.payeeId) {
      where.payeeId = filters.payeeId;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.engagementId) {
      where.engagementId = filters.engagementId;
    }

    if (filters.jobApplicationId) {
      where.jobApplicationId = filters.jobApplicationId;
    }

    if (filters.dateFrom || filters.dateTo) {
      where.createdAt = {};
      if (filters.dateFrom) {
        where.createdAt.gte = filters.dateFrom;
      }
      if (filters.dateTo) {
        where.createdAt.lte = filters.dateTo;
      }
    }

    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: filters.limit || 20,
      skip: filters.offset || 0,
    });

    // Parse metadata JSON
    const transactionsWithParsedMetadata = transactions.map(transaction => ({
      ...transaction,
      metadata: transaction.metadata ? JSON.parse(transaction.metadata) : {},
    }));

    return transactionsWithParsedMetadata;
  }

  /**
   * Get transaction stats (for admin dashboard)
   */
  async getTransactionStats(filters?: { dateFrom?: Date; dateTo?: Date }) {
    const where: any = {};

    if (filters?.dateFrom || filters?.dateTo) {
      where.createdAt = {};
      if (filters.dateFrom) {
        where.createdAt.gte = filters.dateFrom;
      }
      if (filters.dateTo) {
        where.createdAt.lte = filters.dateTo;
      }
    }

    const transactions = await prisma.transaction.findMany({
      where,
      select: {
        type: true,
        category: true,
        status: true,
        amount: true,
        platformFee: true,
      },
    });

    const stats = {
      total: transactions.length,
      byType: {} as Record<string, number>,
      byCategory: {} as Record<string, number>,
      byStatus: {} as Record<string, number>,
      totalAmount: 0,
      totalPlatformFees: 0,
      totalCompleted: 0,
      totalPending: 0,
      totalFailed: 0,
    };

    transactions.forEach(transaction => {
      // Count by type
      stats.byType[transaction.type] = (stats.byType[transaction.type] || 0) + 1;

      // Count by category
      stats.byCategory[transaction.category] = (stats.byCategory[transaction.category] || 0) + 1;

      // Count by status
      stats.byStatus[transaction.status] = (stats.byStatus[transaction.status] || 0) + 1;

      // Sum amounts
      stats.totalAmount += transaction.amount;

      if (transaction.platformFee) {
        stats.totalPlatformFees += transaction.platformFee;
      }

      // Count by status
      if (transaction.status === 'COMPLETED') {
        stats.totalCompleted++;
      } else if (transaction.status === 'PENDING') {
        stats.totalPending++;
      } else if (transaction.status === 'FAILED') {
        stats.totalFailed++;
      }
    });

    return stats;
  }
}

export const transactionService = new TransactionService();
