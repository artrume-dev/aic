export interface Education {
  id: string;
  userId: string;
  institution: string;
  degree: string; // BS, MS, PhD, Certificate, etc.
  fieldOfStudy: string; // Computer Science, Machine Learning, etc.
  startDate?: string;
  endDate?: string;
  present: boolean;
  gpa?: number;
  description?: string;
  verified: boolean; // AI or admin verified
  createdAt: string;
  updatedAt: string;
}

export interface CreateEducationRequest {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate?: string;
  endDate?: string;
  present: boolean;
  gpa?: number;
  description?: string;
}

export interface UpdateEducationRequest {
  institution?: string;
  degree?: string;
  fieldOfStudy?: string;
  startDate?: string;
  endDate?: string;
  present?: boolean;
  gpa?: number;
  description?: string;
}

// Degree options
export const DEGREE_OPTIONS = [
  'Associate Degree',
  'Bachelor\'s Degree (BS/BA)',
  'Master\'s Degree (MS/MA)',
  'PhD',
  'Professional Certificate',
  'Bootcamp Certificate',
  'Online Course Certificate',
  'Other',
] as const;

// Field of Study options for AI/ML
export const AI_FIELD_OF_STUDY = [
  'Computer Science',
  'Machine Learning',
  'Artificial Intelligence',
  'Data Science',
  'Mathematics',
  'Statistics',
  'Electrical Engineering',
  'Computer Engineering',
  'Computational Neuroscience',
  'Robotics',
  'Information Systems',
  'Software Engineering',
  'Physics',
  'Cognitive Science',
  'Other',
] as const;
