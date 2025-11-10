import { Router } from 'express';
import {
  getTransactionById,
  getPayerTransactions,
  getPayeeTransactions,
  getEngagementTransactions,
  getJobApplicationTransactions,
  createTransaction,
  updateTransaction,
  completeTransaction,
  failTransaction,
  searchTransactions,
  getTransactionStats,
} from '../controllers/transaction.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

/**
 * @route   GET /api/transactions/search
 * @desc    Search transactions with filters
 * @access  Private (Admin)
 */
router.get('/search', authenticate, searchTransactions);

/**
 * @route   GET /api/transactions/stats
 * @desc    Get transaction stats (admin dashboard)
 * @access  Private (Admin)
 */
router.get('/stats', authenticate, getTransactionStats);

/**
 * @route   POST /api/transactions
 * @desc    Create a new transaction
 * @access  Private
 */
router.post('/', authenticate, createTransaction);

/**
 * @route   GET /api/transactions/:transactionId
 * @desc    Get transaction by ID
 * @access  Private
 */
router.get('/:transactionId', authenticate, getTransactionById);

/**
 * @route   PUT /api/transactions/:transactionId
 * @desc    Update a transaction
 * @access  Private (Admin)
 */
router.put('/:transactionId', authenticate, updateTransaction);

/**
 * @route   PATCH /api/transactions/:transactionId/complete
 * @desc    Mark transaction as completed
 * @access  Private (Admin/System)
 */
router.patch('/:transactionId/complete', authenticate, completeTransaction);

/**
 * @route   PATCH /api/transactions/:transactionId/fail
 * @desc    Mark transaction as failed
 * @access  Private (Admin/System)
 */
router.patch('/:transactionId/fail', authenticate, failTransaction);

/**
 * @route   GET /api/transactions/payer/:payerId
 * @desc    Get all transactions for a payer
 * @access  Private
 */
router.get('/payer/:payerId', authenticate, getPayerTransactions);

/**
 * @route   GET /api/transactions/payee/:payeeId
 * @desc    Get all transactions for a payee
 * @access  Private
 */
router.get('/payee/:payeeId', authenticate, getPayeeTransactions);

/**
 * @route   GET /api/transactions/engagement/:engagementId
 * @desc    Get all transactions for an engagement
 * @access  Private
 */
router.get('/engagement/:engagementId', authenticate, getEngagementTransactions);

/**
 * @route   GET /api/transactions/job-application/:jobApplicationId
 * @desc    Get all transactions for a job application
 * @access  Private
 */
router.get('/job-application/:jobApplicationId', authenticate, getJobApplicationTransactions);

export default router;
