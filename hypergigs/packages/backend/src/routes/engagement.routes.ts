import { Router } from 'express';
import {
  getFirmEngagements,
  getClientEngagements,
  getEngagementById,
  createEngagement,
  updateEngagement,
  deleteEngagement,
  searchEngagements,
  getEngagementStats,
  updateMilestone,
} from '../controllers/engagement.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

/**
 * @route   GET /api/engagements/search
 * @desc    Search engagements with filters
 * @access  Public
 */
router.get('/search', searchEngagements);

/**
 * @route   POST /api/engagements
 * @desc    Create a new engagement
 * @access  Private
 */
router.post('/', authenticate, createEngagement);

/**
 * @route   GET /api/engagements/:engagementId
 * @desc    Get a single engagement by ID
 * @access  Public
 */
router.get('/:engagementId', getEngagementById);

/**
 * @route   PUT /api/engagements/:engagementId
 * @desc    Update an engagement
 * @access  Private
 */
router.put('/:engagementId', authenticate, updateEngagement);

/**
 * @route   DELETE /api/engagements/:engagementId
 * @desc    Delete an engagement
 * @access  Private
 */
router.delete('/:engagementId', authenticate, deleteEngagement);

/**
 * @route   GET /api/engagements/firm/:firmId
 * @desc    Get all engagements for a consulting firm
 * @access  Public
 */
router.get('/firm/:firmId', getFirmEngagements);

/**
 * @route   GET /api/engagements/firm/:firmId/stats
 * @desc    Get engagement stats for a consulting firm
 * @access  Public
 */
router.get('/firm/:firmId/stats', getEngagementStats);

/**
 * @route   GET /api/engagements/client/:clientId
 * @desc    Get all engagements for a client
 * @access  Public
 */
router.get('/client/:clientId', getClientEngagements);

/**
 * @route   PATCH /api/engagements/:engagementId/milestones/:milestoneId
 * @desc    Update milestone status
 * @access  Private
 */
router.patch('/:engagementId/milestones/:milestoneId', authenticate, updateMilestone);

export default router;
