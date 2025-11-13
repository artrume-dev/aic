// AI Specializations
export const AI_SPECIALIZATIONS = [
  'LLM Integration',
  'Computer Vision',
  'Natural Language Processing',
  'Speech Recognition',
  'Recommendation Systems',
  'Predictive Analytics',
  'Deep Learning',
  'Machine Learning Operations',
  'Conversational AI',
  'AI Strategy & Consulting',
  'Generative AI',
  'Reinforcement Learning',
  'Time Series Analysis',
  'Anomaly Detection',
  'AI Ethics & Governance',
] as const;

// Tech Stack
export const TECH_STACK = [
  'PyTorch',
  'TensorFlow',
  'Scikit-learn',
  'Keras',
  'Hugging Face',
  'LangChain',
  'OpenAI',
  'Anthropic Claude',
  'AWS SageMaker',
  'Google Cloud AI',
  'Azure ML',
  'Python',
  'R',
  'Julia',
  'Apache Spark',
  'MLflow',
  'Kubeflow',
  'Docker',
  'Kubernetes',
  'FastAPI',
  'Ray',
  'Databricks',
] as const;

// Industries
export const INDUSTRIES = [
  'Healthcare',
  'Finance & Banking',
  'Retail & E-commerce',
  'Manufacturing',
  'Transportation & Logistics',
  'Technology',
  'Telecommunications',
  'Energy & Utilities',
  'Education',
  'Government',
  'Insurance',
  'Real Estate',
  'Media & Entertainment',
  'Agriculture',
  'Legal Services',
  'Automotive',
  'Pharmaceuticals',
  'Cybersecurity',
] as const;

// Delivery Models
export const DELIVERY_MODELS = [
  { value: 'FIXED_PRICE', label: 'Fixed Price' },
  { value: 'TIME_AND_MATERIALS', label: 'Time & Materials' },
  { value: 'RETAINER', label: 'Retainer' },
  { value: 'OUTCOME_BASED', label: 'Outcome-Based' },
] as const;

// Partner Tiers
export const PARTNER_TIERS = [
  { value: 'EMERGING', label: 'Emerging Partner', description: 'Growing AI consultancy' },
  { value: 'ESTABLISHED', label: 'Established Partner', description: 'Proven track record' },
  { value: 'PREMIER', label: 'Premier Partner', description: 'Top-tier consultancy' },
  { value: 'ENTERPRISE', label: 'Enterprise Partner', description: 'Elite partner' },
] as const;

// Team Size Ranges
export const TEAM_SIZE_RANGES = [
  { value: '1-10', label: '1-10 consultants' },
  { value: '11-50', label: '11-50 consultants' },
  { value: '51-200', label: '51-200 consultants' },
  { value: '201-500', label: '201-500 consultants' },
  { value: '500+', label: '500+ consultants' },
] as const;

// Minimum Project Budget Ranges
export const MIN_PROJECT_BUDGETS = [
  { value: 10000, label: '$10,000' },
  { value: 25000, label: '$25,000' },
  { value: 50000, label: '$50,000' },
  { value: 100000, label: '$100,000' },
  { value: 250000, label: '$250,000' },
  { value: 500000, label: '$500,000' },
  { value: 1000000, label: '$1,000,000' },
] as const;
