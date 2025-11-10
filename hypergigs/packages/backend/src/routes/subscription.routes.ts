import { Router } from 'express';
import {
  getSubscriptionById,
  getActiveSubscription,
  getSubscriberSubscriptions,
  createSubscription,
  updateSubscription,
  cancelSubscription,
  renewSubscription,
  changeSubscriptionPlan,
  searchSubscriptions,
  getSubscriptionStats,
  getExpiringSubscriptions,
} from '../controllers/subscription.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

/**
 * @route   GET /api/subscriptions/search
 * @desc    Search subscriptions with filters
 * @access  Private (Admin)
 */
router.get('/search', authenticate, searchSubscriptions);

/**
 * @route   GET /api/subscriptions/stats
 * @desc    Get subscription stats (admin dashboard)
 * @access  Private (Admin)
 */
router.get('/stats', authenticate, getSubscriptionStats);

/**
 * @route   GET /api/subscriptions/expiring
 * @desc    Get expiring subscriptions (admin/system)
 * @access  Private (Admin)
 */
router.get('/expiring', authenticate, getExpiringSubscriptions);

/**
 * @route   POST /api/subscriptions
 * @desc    Create a new subscription
 * @access  Private
 */
router.post('/', authenticate, createSubscription);

/**
 * @route   GET /api/subscriptions/:subscriptionId
 * @desc    Get subscription by ID
 * @access  Private
 */
router.get('/:subscriptionId', authenticate, getSubscriptionById);

/**
 * @route   PUT /api/subscriptions/:subscriptionId
 * @desc    Update a subscription
 * @access  Private
 */
router.put('/:subscriptionId', authenticate, updateSubscription);

/**
 * @route   PATCH /api/subscriptions/:subscriptionId/cancel
 * @desc    Cancel a subscription
 * @access  Private
 */
router.patch('/:subscriptionId/cancel', authenticate, cancelSubscription);

/**
 * @route   PATCH /api/subscriptions/:subscriptionId/renew
 * @desc    Renew a subscription
 * @access  Private
 */
router.patch('/:subscriptionId/renew', authenticate, renewSubscription);

/**
 * @route   PATCH /api/subscriptions/:subscriptionId/change-plan
 * @desc    Change subscription plan
 * @access  Private
 */
router.patch('/:subscriptionId/change-plan', authenticate, changeSubscriptionPlan);

/**
 * @route   GET /api/subscriptions/subscriber/:subscriberId/active
 * @desc    Get active subscription for a subscriber
 * @access  Private
 */
router.get('/subscriber/:subscriberId/active', authenticate, getActiveSubscription);

/**
 * @route   GET /api/subscriptions/subscriber/:subscriberId
 * @desc    Get all subscriptions for a subscriber
 * @access  Private
 */
router.get('/subscriber/:subscriberId', authenticate, getSubscriberSubscriptions);

export default router;
