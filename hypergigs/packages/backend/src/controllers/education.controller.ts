import { Request, Response } from 'express';
import { educationService } from '../services/education.service.js';
import { logger } from '../utils/logger.js';

/**
 * Get all education records for a user
 */
export const getUserEducation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const education = await educationService.getEducationByUserId(userId);

    res.status(200).json({ education });
  } catch (error) {
    logger.error('Get user education error:', error);

    if (error instanceof Error) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to get education records' });
    }
  }
};

/**
 * Get current user's education records
 */
export const getMyEducation = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const education = await educationService.getEducationByUserId(req.userId);

    res.status(200).json({ education });
  } catch (error) {
    logger.error('Get my education error:', error);

    if (error instanceof Error) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to get education records' });
    }
  }
};

/**
 * Get a single education record by ID
 */
export const getEducationById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { educationId } = req.params;

    const education = await educationService.getEducationById(educationId);

    res.status(200).json({ education });
  } catch (error) {
    logger.error('Get education by ID error:', error);

    if (error instanceof Error) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to get education record' });
    }
  }
};

/**
 * Create a new education record
 */
export const createEducation = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { institution, degree, fieldOfStudy, startDate, endDate, present, description, gpa } = req.body;

    // Validation
    if (!institution || !degree || !fieldOfStudy) {
      res.status(400).json({ error: 'Institution, degree, and field of study are required' });
      return;
    }

    const education = await educationService.createEducation(req.userId, {
      institution,
      degree,
      fieldOfStudy,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      present,
      description,
      gpa: gpa ? parseFloat(gpa) : undefined,
    });

    res.status(201).json({ education });
  } catch (error) {
    logger.error('Create education error:', error);

    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to create education record' });
    }
  }
};

/**
 * Update an education record
 */
export const updateEducation = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { educationId } = req.params;
    const { institution, degree, fieldOfStudy, startDate, endDate, present, description, gpa } = req.body;

    const education = await educationService.updateEducation(educationId, req.userId, {
      institution,
      degree,
      fieldOfStudy,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      present,
      description,
      gpa: gpa !== undefined ? parseFloat(gpa) : undefined,
    });

    res.status(200).json({ education });
  } catch (error) {
    logger.error('Update education error:', error);

    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to update education record' });
    }
  }
};

/**
 * Delete an education record
 */
export const deleteEducation = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { educationId } = req.params;

    await educationService.deleteEducation(educationId, req.userId);

    res.status(200).json({ message: 'Education record deleted successfully' });
  } catch (error) {
    logger.error('Delete education error:', error);

    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to delete education record' });
    }
  }
};

/**
 * Get education stats for a user (for verification purposes)
 */
export const getEducationStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const stats = await educationService.getEducationStats(userId);

    res.status(200).json({ stats });
  } catch (error) {
    logger.error('Get education stats error:', error);

    if (error instanceof Error) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to get education stats' });
    }
  }
};
