import { prisma } from '../lib/prisma.js';
import { logger } from '../utils/logger.js';

export interface CreateEducationData {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate?: Date;
  endDate?: Date;
  present?: boolean;
  description?: string;
  gpa?: number;
}

export interface UpdateEducationData {
  institution?: string;
  degree?: string;
  fieldOfStudy?: string;
  startDate?: Date;
  endDate?: Date;
  present?: boolean;
  description?: string;
  gpa?: number;
}

export class EducationService {
  /**
   * Get all education records for a user
   */
  async getEducationByUserId(userId: string) {
    const education = await prisma.education.findMany({
      where: { userId },
      orderBy: { startDate: 'desc' },
    });

    logger.info(`Retrieved ${education.length} education records for user ${userId}`);
    return education;
  }

  /**
   * Get a single education record by ID
   */
  async getEducationById(educationId: string) {
    const education = await prisma.education.findUnique({
      where: { id: educationId },
    });

    if (!education) {
      throw new Error('Education record not found');
    }

    return education;
  }

  /**
   * Create a new education record
   */
  async createEducation(userId: string, data: CreateEducationData) {
    // Validation: If present is true, endDate should be null
    if (data.present && data.endDate) {
      throw new Error('Cannot set endDate when present is true');
    }

    // Validation: startDate should not be in the future
    if (data.startDate && data.startDate > new Date()) {
      throw new Error('Start date cannot be in the future');
    }

    // Validation: endDate should be after startDate
    if (data.endDate && data.startDate && data.startDate > data.endDate) {
      throw new Error('End date must be after start date');
    }

    const education = await prisma.education.create({
      data: {
        ...data,
        userId,
        present: data.present || false,
      },
    });

    logger.info(`Education record created for user ${userId}: ${education.id}`);
    return education;
  }

  /**
   * Update an education record
   */
  async updateEducation(educationId: string, userId: string, data: UpdateEducationData) {
    // Verify ownership
    const education = await prisma.education.findFirst({
      where: {
        id: educationId,
        userId,
      },
    });

    if (!education) {
      throw new Error('Education record not found or unauthorized');
    }

    // Validation: If present is being set to true, clear endDate
    if (data.present && data.endDate) {
      throw new Error('Cannot set endDate when present is true');
    }

    // Validation: startDate should not be in the future
    if (data.startDate && data.startDate > new Date()) {
      throw new Error('Start date cannot be in the future');
    }

    // Validation: endDate should be after startDate
    const startDate = data.startDate || education.startDate;
    if (data.endDate && startDate && startDate > data.endDate) {
      throw new Error('End date must be after start date');
    }

    const updatedEducation = await prisma.education.update({
      where: { id: educationId },
      data,
    });

    logger.info(`Education record updated: ${educationId}`);
    return updatedEducation;
  }

  /**
   * Delete an education record
   */
  async deleteEducation(educationId: string, userId: string) {
    // Verify ownership
    const education = await prisma.education.findFirst({
      where: {
        id: educationId,
        userId,
      },
    });

    if (!education) {
      throw new Error('Education record not found or unauthorized');
    }

    await prisma.education.delete({
      where: { id: educationId },
    });

    logger.info(`Education record deleted: ${educationId}`);
    return { success: true };
  }

  /**
   * Get education stats for a user (for verification purposes)
   */
  async getEducationStats(userId: string) {
    const education = await prisma.education.findMany({
      where: { userId },
      select: {
        degree: true,
        fieldOfStudy: true,
        institution: true,
      },
    });

    // Extract unique degree types and fields
    const uniqueDegrees = [...new Set(education.map(e => e.degree))];
    const uniqueFields = [...new Set(education.map(e => e.fieldOfStudy).filter(Boolean))];
    const uniqueInstitutions = [...new Set(education.map(e => e.institution))];

    return {
      totalRecords: education.length,
      degrees: uniqueDegrees,
      fields: uniqueFields,
      institutions: uniqueInstitutions,
    };
  }
}

export const educationService = new EducationService();
