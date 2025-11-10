import { Router } from 'express';
import {
  getUserEducation,
  getMyEducation,
  getEducationById,
  createEducation,
  updateEducation,
  deleteEducation,
  getEducationStats,
} from '../controllers/education.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

/**
 * @route   GET /api/education/me
 * @desc    Get current user's education records
 * @access  Private
 */
router.get('/me', authenticate, getMyEducation);

/**
 * @route   POST /api/education/me
 * @desc    Create a new education record
 * @access  Private
 */
router.post('/me', authenticate, createEducation);

/**
 * @route   PUT /api/education/me/:educationId
 * @desc    Update an education record
 * @access  Private
 */
router.put('/me/:educationId', authenticate, updateEducation);

/**
 * @route   DELETE /api/education/me/:educationId
 * @desc    Delete an education record
 * @access  Private
 */
router.delete('/me/:educationId', authenticate, deleteEducation);

/**
 * @route   GET /api/education/:educationId
 * @desc    Get a single education record by ID
 * @access  Public
 */
router.get('/:educationId', getEducationById);

/**
 * @route   GET /api/education/user/:userId
 * @desc    Get all education records for a user
 * @access  Public
 */
router.get('/user/:userId', getUserEducation);

/**
 * @route   GET /api/education/user/:userId/stats
 * @desc    Get education stats for a user (for verification purposes)
 * @access  Public
 */
router.get('/user/:userId/stats', getEducationStats);

export default router;
