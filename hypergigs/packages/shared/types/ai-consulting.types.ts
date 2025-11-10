/**
 * AI Consulting Marketplace - Shared TypeScript Types
 *
 * These types are shared between frontend and backend for type safety.
 * Auto-generated from Prisma schema with additional enums and interfaces.
 */

// ============================================================================
// USER TYPES
// ============================================================================

export enum UserRole {
  FREELANCER = 'FREELANCER',
  AI_TALENT = 'AI_TALENT',
  FIRM_MEMBER = 'FIRM_MEMBER',
  ADMIN = 'ADMIN',
}

export enum TalentTier {
  JUNIOR = 'JUNIOR',           // 0-2 years AI experience
  MID = 'MID',                 // 2-5 years AI experience
  SENIOR = 'SENIOR',           // 5-8 years AI experience
  EXPERT = 'EXPERT',           // 8-12 years AI experience
  PRINCIPAL = 'PRINCIPAL',     // 12+ years AI experience
}

export enum EmploymentPreference {
  CONTRACT = 'CONTRACT',
  TEMP_TO_PERM = 'TEMP_TO_PERM',
  PERMANENT = 'PERMANENT',
  ANY = 'ANY',
}

export enum VerificationStatus {
  UNVERIFIED = 'UNVERIFIED',
  PENDING = 'PENDING',
  UNDER_REVIEW = 'UNDER_REVIEW',
  VERIFIED = 'VERIFIED',
  VERIFIED_EXPERT = 'VERIFIED_EXPERT',
  REJECTED = 'REJECTED',
}

export enum AvailabilityStatus {
  AVAILABLE = 'AVAILABLE',
  BUSY = 'BUSY',
  NOT_LOOKING = 'NOT_LOOKING',
}

// ============================================================================
// TEAM / CONSULTING FIRM TYPES
// ============================================================================

export enum TeamType {
  // Generic Types
  TEAM = 'TEAM',
  COMPANY = 'COMPANY',
  ORGANIZATION = 'ORGANIZATION',
  DEPARTMENT = 'DEPARTMENT',

  // AI Consulting Types
  AI_CONSULTING_FIRM = 'AI_CONSULTING_FIRM',
  AI_STUDIO = 'AI_STUDIO',
  ML_AGENCY = 'ML_AGENCY',
  DATA_SCIENCE_FIRM = 'DATA_SCIENCE_FIRM',
  AI_RESEARCH_LAB = 'AI_RESEARCH_LAB',
}

export enum PartnerTier {
  EMERGING = 'EMERGING',         // 1-10 consultants, <2 years
  ESTABLISHED = 'ESTABLISHED',   // 10-50 consultants, 2-5 years
  PREMIER = 'PREMIER',           // 50-200 consultants, 5+ years
  ENTERPRISE = 'ENTERPRISE',     // 200+ consultants, 10+ years
}

export enum DeliveryModel {
  ONSITE = 'ONSITE',
  NEARSHORE = 'NEARSHORE',
  OFFSHORE = 'OFFSHORE',
  HYBRID = 'HYBRID',
}

export enum PricingModel {
  FIXED_PRICE = 'FIXED_PRICE',
  TIME_MATERIAL = 'TIME_MATERIAL',
  STAFF_AUG = 'STAFF_AUG',
  MANAGED_SERVICES = 'MANAGED_SERVICES',
  HYBRID = 'HYBRID',
}

// ============================================================================
// CONSULTING ROLES (Pyramid Structure)
// ============================================================================

export enum ConsultingRole {
  // FINDERS (Business Development, Client Relationships)
  SENIOR_PARTNER = 'SENIOR_PARTNER',
  PARTNER = 'PARTNER',
  JUNIOR_PARTNER = 'JUNIOR_PARTNER',

  // MINDERS (Project Management, Team Leadership)
  ENGAGEMENT_MANAGER = 'ENGAGEMENT_MANAGER',
  DELIVERY_LEAD = 'DELIVERY_LEAD',
  PROJECT_MANAGER = 'PROJECT_MANAGER',

  // SENIOR INDIVIDUAL CONTRIBUTORS (Grinders + Minders)
  PRINCIPAL_AI_ENGINEER = 'PRINCIPAL_AI_ENGINEER',
  SENIOR_ML_ENGINEER = 'SENIOR_ML_ENGINEER',
  SENIOR_DATA_SCIENTIST = 'SENIOR_DATA_SCIENTIST',
  TECH_ARCHITECT = 'TECH_ARCHITECT',
  AI_RESEARCH_SCIENTIST = 'AI_RESEARCH_SCIENTIST',

  // MID-LEVEL INDIVIDUAL CONTRIBUTORS (Grinders)
  ML_ENGINEER = 'ML_ENGINEER',
  DATA_SCIENTIST = 'DATA_SCIENTIST',
  NLP_ENGINEER = 'NLP_ENGINEER',
  COMPUTER_VISION_ENGINEER = 'COMPUTER_VISION_ENGINEER',
  MLOPS_ENGINEER = 'MLOPS_ENGINEER',
  PROMPT_ENGINEER = 'PROMPT_ENGINEER',

  // JUNIOR INDIVIDUAL CONTRIBUTORS (Grinders)
  JUNIOR_ML_ENGINEER = 'JUNIOR_ML_ENGINEER',
  JUNIOR_DATA_SCIENTIST = 'JUNIOR_DATA_SCIENTIST',
  DATA_ANALYST = 'DATA_ANALYST',
  AI_QA_ENGINEER = 'AI_QA_ENGINEER',
  RESEARCH_ASSISTANT = 'RESEARCH_ASSISTANT',
}

// ============================================================================
// AI TALENT ROLES
// ============================================================================

export enum AITalentRole {
  // Machine Learning
  ML_ENGINEER = 'ML_ENGINEER',
  SENIOR_ML_ENGINEER = 'SENIOR_ML_ENGINEER',
  PRINCIPAL_ML_ENGINEER = 'PRINCIPAL_ML_ENGINEER',

  // Large Language Models
  LLM_ENGINEER = 'LLM_ENGINEER',
  PROMPT_ENGINEER = 'PROMPT_ENGINEER',
  LLM_FINE_TUNING_SPECIALIST = 'LLM_FINE_TUNING_SPECIALIST',

  // Computer Vision
  COMPUTER_VISION_ENGINEER = 'COMPUTER_VISION_ENGINEER',
  IMAGE_PROCESSING_ENGINEER = 'IMAGE_PROCESSING_ENGINEER',
  VIDEO_AI_ENGINEER = 'VIDEO_AI_ENGINEER',

  // Natural Language Processing
  NLP_ENGINEER = 'NLP_ENGINEER',
  SPEECH_ENGINEER = 'SPEECH_ENGINEER',
  TRANSLATION_ENGINEER = 'TRANSLATION_ENGINEER',

  // Data Science
  DATA_SCIENTIST = 'DATA_SCIENTIST',
  SENIOR_DATA_SCIENTIST = 'SENIOR_DATA_SCIENTIST',
  RESEARCH_SCIENTIST = 'RESEARCH_SCIENTIST',

  // Infrastructure & Operations
  MLOPS_ENGINEER = 'MLOPS_ENGINEER',
  DATA_ENGINEER = 'DATA_ENGINEER',
  ML_PLATFORM_ENGINEER = 'ML_PLATFORM_ENGINEER',
  DEVOPS_FOR_AI = 'DEVOPS_FOR_AI',

  // Specialized
  REINFORCEMENT_LEARNING_ENGINEER = 'REINFORCEMENT_LEARNING_ENGINEER',
  GENERATIVE_AI_ENGINEER = 'GENERATIVE_AI_ENGINEER',
  AI_SAFETY_ENGINEER = 'AI_SAFETY_ENGINEER',
  EXPLAINABLE_AI_ENGINEER = 'EXPLAINABLE_AI_ENGINEER',

  // Quality & Testing
  AI_QA_ENGINEER = 'AI_QA_ENGINEER',
  AI_TEST_ENGINEER = 'AI_TEST_ENGINEER',
  RLHF_ANNOTATOR = 'RLHF_ANNOTATOR',
  DATA_LABELING_SPECIALIST = 'DATA_LABELING_SPECIALIST',

  // Product & Management
  AI_PRODUCT_MANAGER = 'AI_PRODUCT_MANAGER',
  ML_PRODUCT_MANAGER = 'ML_PRODUCT_MANAGER',
  AI_PROGRAM_MANAGER = 'AI_PROGRAM_MANAGER',

  // Adjacent Technical
  BACKEND_ENGINEER_AI = 'BACKEND_ENGINEER_AI',
  FRONTEND_ENGINEER_AI = 'FRONTEND_ENGINEER_AI',
  FULL_STACK_AI_ENGINEER = 'FULL_STACK_AI_ENGINEER',
}

// ============================================================================
// AI SPECIALIZATIONS
// ============================================================================

export enum AISpecialization {
  // Generative AI
  LLM_INTEGRATION = 'LLM_INTEGRATION',
  LLM_FINE_TUNING = 'LLM_FINE_TUNING',
  GENERATIVE_AI_APPS = 'GENERATIVE_AI_APPS',
  PROMPT_ENGINEERING = 'PROMPT_ENGINEERING',

  // Computer Vision
  COMPUTER_VISION = 'COMPUTER_VISION',
  IMAGE_GENERATION = 'IMAGE_GENERATION',
  VIDEO_ANALYSIS = 'VIDEO_ANALYSIS',
  OCR_DOCUMENT_AI = 'OCR_DOCUMENT_AI',

  // Natural Language Processing
  NLP_TEXT_ANALYTICS = 'NLP_TEXT_ANALYTICS',
  SPEECH_RECOGNITION = 'SPEECH_RECOGNITION',
  SPEECH_SYNTHESIS = 'SPEECH_SYNTHESIS',
  TRANSLATION_SERVICES = 'TRANSLATION_SERVICES',

  // Traditional ML
  PREDICTIVE_ANALYTICS = 'PREDICTIVE_ANALYTICS',
  RECOMMENDATION_SYSTEMS = 'RECOMMENDATION_SYSTEMS',
  CLASSIFICATION_MODELS = 'CLASSIFICATION_MODELS',
  CLUSTERING_SEGMENTATION = 'CLUSTERING_SEGMENTATION',
  ANOMALY_DETECTION = 'ANOMALY_DETECTION',

  // Infrastructure & Operations
  MLOPS = 'MLOPS',
  AI_INFRASTRUCTURE = 'AI_INFRASTRUCTURE',
  MODEL_OPTIMIZATION = 'MODEL_OPTIMIZATION',

  // Strategy & Advisory
  AI_STRATEGY = 'AI_STRATEGY',
  AI_ETHICS_GOVERNANCE = 'AI_ETHICS_GOVERNANCE',
  AI_PRODUCT_DEVELOPMENT = 'AI_PRODUCT_DEVELOPMENT',

  // Industry-Specific
  HEALTHCARE_AI = 'HEALTHCARE_AI',
  FINANCE_AI = 'FINANCE_AI',
  RETAIL_AI = 'RETAIL_AI',
  MANUFACTURING_AI = 'MANUFACTURING_AI',
  LEGAL_AI = 'LEGAL_AI',
}

// ============================================================================
// TECH STACK
// ============================================================================

export const AI_TECH_STACK = [
  // Frameworks
  'PyTorch',
  'TensorFlow',
  'JAX',
  'Scikit-learn',
  'Keras',

  // LLMs & Transformers
  'OpenAI API',
  'Anthropic API',
  'Hugging Face',
  'LangChain',
  'LlamaIndex',

  // Computer Vision
  'OpenCV',
  'YOLO',
  'Detectron2',
  'MMDetection',

  // NLP
  'spaCy',
  'NLTK',
  'Transformers',
  'Sentence-BERT',

  // MLOps
  'MLflow',
  'Weights & Biases',
  'Kubeflow',
  'BentoML',
  'TFX',

  // Cloud & Infrastructure
  'AWS SageMaker',
  'Google Vertex AI',
  'Azure ML',
  'Databricks',

  // Vector Databases
  'Pinecone',
  'Weaviate',
  'Milvus',
  'Qdrant',
  'ChromaDB',

  // Programming Languages
  'Python',
  'R',
  'Julia',
  'Scala',
  'Java',
] as const;

// ============================================================================
// SKILL TYPES
// ============================================================================

export enum SkillCategory {
  AI_SPECIALIZATION = 'AI_SPECIALIZATION',
  TECH_STACK = 'TECH_STACK',
  SOFT_SKILL = 'SOFT_SKILL',
  INDUSTRY = 'INDUSTRY',
  OTHER = 'OTHER',
}

export enum SkillProficiency {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  EXPERT = 'EXPERT',
}

// ============================================================================
// JOB TYPES
// ============================================================================

export enum JobType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  CONTRACT = 'CONTRACT',
  FREELANCE = 'FREELANCE',
}

export enum JobStatus {
  ACTIVE = 'ACTIVE',
  CLOSED = 'CLOSED',
  DRAFT = 'DRAFT',
}

export enum JobCategory {
  REGULAR = 'REGULAR',           // Regular job posting
  TALENT_HIRE = 'TALENT_HIRE',   // Consulting firm hiring talent
}

export enum ApplicationStatus {
  PENDING = 'PENDING',
  REVIEWING = 'REVIEWING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  HIRED = 'HIRED',
}

// ============================================================================
// ENGAGEMENT TYPES
// ============================================================================

export enum EngagementStatus {
  PROPOSAL = 'PROPOSAL',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

// ============================================================================
// TRANSACTION TYPES
// ============================================================================

export enum TransactionType {
  CONSULTING_PROJECT = 'CONSULTING_PROJECT',
  TALENT_PLACEMENT = 'TALENT_PLACEMENT',
  SUBSCRIPTION = 'SUBSCRIPTION',
  FEATURED_LISTING = 'FEATURED_LISTING',
}

export enum TransactionCategory {
  PLATFORM_FEE = 'PLATFORM_FEE',
  PAYOUT = 'PAYOUT',
  SUBSCRIPTION_PAYMENT = 'SUBSCRIPTION_PAYMENT',
  REFUND = 'REFUND',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentMethod {
  STRIPE = 'STRIPE',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CREDIT_CARD = 'CREDIT_CARD',
}

// ============================================================================
// SUBSCRIPTION TYPES
// ============================================================================

export enum SubscriptionPlan {
  BASIC = 'BASIC',
  PRO = 'PRO',
  ENTERPRISE = 'ENTERPRISE',
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
  PAST_DUE = 'PAST_DUE',
}

export enum SubscriptionInterval {
  MONTH = 'MONTH',
  YEAR = 'YEAR',
}

export enum SubscriberType {
  USER = 'USER',
  TEAM = 'TEAM',
}

// ============================================================================
// VERIFICATION DATA STRUCTURES
// ============================================================================

export interface VerificationScores {
  portfolioScore: number;          // 0-100
  skillScore: number;              // 0-100
  experienceScore: number;         // 0-100
  technicalScore?: number;         // 0-100 (if technical assessment completed)
  overallScore: number;            // 0-100 (weighted average)
}

export interface PortfolioAnalysisResult {
  technicalComplexity: number;     // 0-100
  projectImpact: number;           // 0-100
  codeQuality?: number;            // 0-100 (if GitHub provided)
  aiMlDepth: number;               // 0-100
  visualPresentation: number;      // 0-100
  strengths: string[];
  weaknesses: string[];
  detailedFeedback: string;
}

export interface SkillValidationResult {
  skill: string;
  claimed: boolean;
  claimedLevel: SkillProficiency;
  evidenceFound: boolean;
  proficiencyLevel: SkillProficiency;
  confidence: number;              // 0-1
  yearsEvident: number;
  reasoning: string;
}

export interface ExperienceVerificationResult {
  experienceScore: number;         // 0-100
  timelineValid: boolean;
  progressionRealistic: boolean;
  companiesVerified: string;
  totalYearsExperience: number;
  totalYearsAIExperience: number;
  confidence: number;              // 0-1
  redFlags: RedFlag[];
  summary: string;
  recommendations: string[];
}

export interface RedFlag {
  type: 'OVERSTATEMENT' | 'MISSING_EVIDENCE' | 'IMPOSSIBLE_TIMELINE' | 'RAPID_PROMOTION' | 'UNVERIFIABLE_COMPANY' | 'GAP_IN_EMPLOYMENT';
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  skill?: string;
}

export interface TechnicalAssessmentResult {
  technicalScore: number;          // 0-100
  breakdown: {
    coding: number;
    problemSolving: number;
    communication: number;
    awareness: number;
  };
  strengths: string[];
  areasForImprovement: string[];
  recommendation: string;
}

// Full verification data stored in JSON
export interface VerificationData {
  scores: VerificationScores;
  portfolioAnalysis?: PortfolioAnalysisResult;
  skillValidation?: SkillValidationResult[];
  experienceVerification?: ExperienceVerificationResult;
  technicalAssessment?: TechnicalAssessmentResult;
  adminNotes?: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

// ============================================================================
// RATE CARD TYPES
// ============================================================================

export interface RoleRateRange {
  role: ConsultingRole | AITalentRole;
  minHourlyRate: number;
  maxHourlyRate: number;
  currency: string;
  description?: string;
}

// ============================================================================
// MILESTONE TYPES
// ============================================================================

export interface Milestone {
  id: string;
  name: string;
  description?: string;
  percentage: number;              // % of total value
  amount: number;
  dueDate?: string;                // ISO date string
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'PAID';
  completedAt?: string;
  paidAt?: string;
}

// ============================================================================
// HELPER TYPES
// ============================================================================

export type TechStack = typeof AI_TECH_STACK[number];

export interface AISkillWithProficiency {
  skill: string;
  proficiency: SkillProficiency;
  yearsOfExperience?: number;
  verified: boolean;
  verificationScore?: number;
}

export interface TeamComposition {
  partners: number;
  managers: number;
  seniorICs: number;
  midLevelICs: number;
  juniorICs: number;
  total: number;
  leverageRatio: string;           // e.g., "1:2:5"
}

// ============================================================================
// TIER PROGRESSION TYPES
// ============================================================================

export interface TierRequirements {
  tier: TalentTier | PartnerTier;
  requirements: string[];
  benefits: string[];
  minimumScore?: number;
}

// ============================================================================
// EXPORT ALL ENUMS AS OBJECT FOR RUNTIME USE
// ============================================================================

export const Enums = {
  UserRole,
  TalentTier,
  EmploymentPreference,
  VerificationStatus,
  AvailabilityStatus,
  TeamType,
  PartnerTier,
  DeliveryModel,
  PricingModel,
  ConsultingRole,
  AITalentRole,
  AISpecialization,
  SkillCategory,
  SkillProficiency,
  JobType,
  JobStatus,
  JobCategory,
  ApplicationStatus,
  EngagementStatus,
  TransactionType,
  TransactionCategory,
  TransactionStatus,
  PaymentMethod,
  SubscriptionPlan,
  SubscriptionStatus,
  SubscriptionInterval,
  SubscriberType,
};

// ============================================================================
// TYPE GUARDS
// ============================================================================

export function isAIConsultingFirm(teamType: string): boolean {
  return [
    TeamType.AI_CONSULTING_FIRM,
    TeamType.AI_STUDIO,
    TeamType.ML_AGENCY,
    TeamType.DATA_SCIENCE_FIRM,
    TeamType.AI_RESEARCH_LAB,
  ].includes(teamType as TeamType);
}

export function isVerified(status: string): boolean {
  return [
    VerificationStatus.VERIFIED,
    VerificationStatus.VERIFIED_EXPERT,
  ].includes(status as VerificationStatus);
}

export function isSeniorRole(role: ConsultingRole | AITalentRole): boolean {
  const seniorRoles = [
    ConsultingRole.SENIOR_PARTNER,
    ConsultingRole.PARTNER,
    ConsultingRole.PRINCIPAL_AI_ENGINEER,
    ConsultingRole.SENIOR_ML_ENGINEER,
    ConsultingRole.SENIOR_DATA_SCIENTIST,
    ConsultingRole.TECH_ARCHITECT,
    AITalentRole.SENIOR_ML_ENGINEER,
    AITalentRole.PRINCIPAL_ML_ENGINEER,
    AITalentRole.SENIOR_DATA_SCIENTIST,
  ];
  return seniorRoles.includes(role as any);
}
