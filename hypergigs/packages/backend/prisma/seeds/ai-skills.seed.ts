/**
 * AI Skills Taxonomy Seed Data
 *
 * Populates the database with comprehensive AI/ML skills
 * Run with: npm run seed:ai-skills
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// AI Specializations
const AI_SPECIALIZATIONS = [
  // Generative AI
  {
    name: 'LLM Integration',
    category: 'AI_SPECIALIZATION',
    subcategory: 'GENERATIVE_AI',
    description: 'Integration of Large Language Models like GPT, Claude, Gemini into applications',
    isAISkill: true,
  },
  {
    name: 'LLM Fine-Tuning',
    category: 'AI_SPECIALIZATION',
    subcategory: 'GENERATIVE_AI',
    description: 'Custom training and fine-tuning of language models for specific use cases',
    isAISkill: true,
  },
  {
    name: 'Prompt Engineering',
    category: 'AI_SPECIALIZATION',
    subcategory: 'GENERATIVE_AI',
    description: 'RAG, chain-of-thought, and advanced prompting techniques',
    isAISkill: true,
  },
  {
    name: 'Generative AI Applications',
    category: 'AI_SPECIALIZATION',
    subcategory: 'GENERATIVE_AI',
    description: 'Building chatbots, content generation, and AI-powered applications',
    isAISkill: true,
  },

  // Computer Vision
  {
    name: 'Computer Vision',
    category: 'AI_SPECIALIZATION',
    subcategory: 'COMPUTER_VISION',
    description: 'Object detection, recognition, and image analysis',
    isAISkill: true,
  },
  {
    name: 'Image Generation',
    category: 'AI_SPECIALIZATION',
    subcategory: 'COMPUTER_VISION',
    description: 'Stable Diffusion, DALL-E, and generative image models',
    isAISkill: true,
  },
  {
    name: 'Video Analysis',
    category: 'AI_SPECIALIZATION',
    subcategory: 'COMPUTER_VISION',
    description: 'Action recognition, tracking, and video understanding',
    isAISkill: true,
  },
  {
    name: 'OCR & Document AI',
    category: 'AI_SPECIALIZATION',
    subcategory: 'COMPUTER_VISION',
    description: 'Text extraction and intelligent document processing',
    isAISkill: true,
  },

  // Natural Language Processing
  {
    name: 'NLP & Text Analytics',
    category: 'AI_SPECIALIZATION',
    subcategory: 'NLP',
    description: 'Sentiment analysis, text classification, and NER',
    isAISkill: true,
  },
  {
    name: 'Speech Recognition',
    category: 'AI_SPECIALIZATION',
    subcategory: 'NLP',
    description: 'Voice-to-text and speech-to-text systems',
    isAISkill: true,
  },
  {
    name: 'Speech Synthesis',
    category: 'AI_SPECIALIZATION',
    subcategory: 'NLP',
    description: 'Text-to-speech and voice generation',
    isAISkill: true,
  },
  {
    name: 'Machine Translation',
    category: 'AI_SPECIALIZATION',
    subcategory: 'NLP',
    description: 'NMT and multilingual models',
    isAISkill: true,
  },

  // Traditional ML
  {
    name: 'Predictive Analytics',
    category: 'AI_SPECIALIZATION',
    subcategory: 'TRADITIONAL_ML',
    description: 'Forecasting and time series analysis',
    isAISkill: true,
  },
  {
    name: 'Recommendation Systems',
    category: 'AI_SPECIALIZATION',
    subcategory: 'TRADITIONAL_ML',
    description: 'Collaborative filtering and personalization engines',
    isAISkill: true,
  },
  {
    name: 'Classification Models',
    category: 'AI_SPECIALIZATION',
    subcategory: 'TRADITIONAL_ML',
    description: 'Supervised learning for classification tasks',
    isAISkill: true,
  },
  {
    name: 'Clustering & Segmentation',
    category: 'AI_SPECIALIZATION',
    subcategory: 'TRADITIONAL_ML',
    description: 'Unsupervised learning and pattern discovery',
    isAISkill: true,
  },
  {
    name: 'Anomaly Detection',
    category: 'AI_SPECIALIZATION',
    subcategory: 'TRADITIONAL_ML',
    description: 'Fraud detection and outlier identification',
    isAISkill: true,
  },

  // MLOps
  {
    name: 'MLOps',
    category: 'AI_SPECIALIZATION',
    subcategory: 'MLOPS',
    description: 'Model deployment, monitoring, and lifecycle management',
    isAISkill: true,
  },
  {
    name: 'AI Infrastructure',
    category: 'AI_SPECIALIZATION',
    subcategory: 'MLOPS',
    description: 'GPU optimization and scalable ML systems',
    isAISkill: true,
  },
  {
    name: 'Model Optimization',
    category: 'AI_SPECIALIZATION',
    subcategory: 'MLOPS',
    description: 'Quantization, pruning, and efficiency improvements',
    isAISkill: true,
  },

  // Strategy & Advisory
  {
    name: 'AI Strategy',
    category: 'AI_SPECIALIZATION',
    subcategory: 'STRATEGY',
    description: 'AI roadmaps and feasibility studies',
    isAISkill: true,
  },
  {
    name: 'AI Ethics & Governance',
    category: 'AI_SPECIALIZATION',
    subcategory: 'STRATEGY',
    description: 'Responsible AI and compliance frameworks',
    isAISkill: true,
  },
  {
    name: 'AI Product Development',
    category: 'AI_SPECIALIZATION',
    subcategory: 'STRATEGY',
    description: 'Building AI-first products and features',
    isAISkill: true,
  },

  // Industry-Specific
  {
    name: 'Healthcare AI',
    category: 'AI_SPECIALIZATION',
    subcategory: 'INDUSTRY',
    description: 'Medical imaging, diagnostics, and healthcare applications',
    isAISkill: true,
  },
  {
    name: 'Finance AI',
    category: 'AI_SPECIALIZATION',
    subcategory: 'INDUSTRY',
    description: 'Fraud detection, algorithmic trading, and financial ML',
    isAISkill: true,
  },
  {
    name: 'Retail AI',
    category: 'AI_SPECIALIZATION',
    subcategory: 'INDUSTRY',
    description: 'Demand forecasting and personalization',
    isAISkill: true,
  },
  {
    name: 'Manufacturing AI',
    category: 'AI_SPECIALIZATION',
    subcategory: 'INDUSTRY',
    description: 'Predictive maintenance and quality control',
    isAISkill: true,
  },
  {
    name: 'Legal AI',
    category: 'AI_SPECIALIZATION',
    subcategory: 'INDUSTRY',
    description: 'Contract analysis and e-discovery',
    isAISkill: true,
  },
];

// ML/DL Frameworks
const ML_FRAMEWORKS = [
  {
    name: 'PyTorch',
    category: 'TECH_STACK',
    subcategory: 'ML_FRAMEWORK',
    description: 'Deep learning framework by Meta',
    isAISkill: true,
  },
  {
    name: 'TensorFlow',
    category: 'TECH_STACK',
    subcategory: 'ML_FRAMEWORK',
    description: 'End-to-end ML platform by Google',
    isAISkill: true,
  },
  {
    name: 'JAX',
    category: 'TECH_STACK',
    subcategory: 'ML_FRAMEWORK',
    description: 'High-performance numerical computing library',
    isAISkill: true,
  },
  {
    name: 'Scikit-learn',
    category: 'TECH_STACK',
    subcategory: 'ML_FRAMEWORK',
    description: 'Traditional machine learning library',
    isAISkill: true,
  },
  {
    name: 'Keras',
    category: 'TECH_STACK',
    subcategory: 'ML_FRAMEWORK',
    description: 'High-level neural networks API',
    isAISkill: true,
  },
];

// LLM & Transformer Tools
const LLM_TOOLS = [
  {
    name: 'OpenAI API',
    category: 'TECH_STACK',
    subcategory: 'LLM_API',
    description: 'GPT models and API integration',
    isAISkill: true,
  },
  {
    name: 'Anthropic API',
    category: 'TECH_STACK',
    subcategory: 'LLM_API',
    description: 'Claude models and API',
    isAISkill: true,
  },
  {
    name: 'Hugging Face',
    category: 'TECH_STACK',
    subcategory: 'LLM_TOOLS',
    description: 'Transformers library and model hub',
    isAISkill: true,
  },
  {
    name: 'LangChain',
    category: 'TECH_STACK',
    subcategory: 'LLM_TOOLS',
    description: 'Framework for building LLM applications',
    isAISkill: true,
  },
  {
    name: 'LlamaIndex',
    category: 'TECH_STACK',
    subcategory: 'LLM_TOOLS',
    description: 'Data framework for LLM applications',
    isAISkill: true,
  },
  {
    name: 'Ollama',
    category: 'TECH_STACK',
    subcategory: 'LLM_TOOLS',
    description: 'Run LLMs locally',
    isAISkill: true,
  },
];

// Computer Vision Libraries
const CV_LIBRARIES = [
  {
    name: 'OpenCV',
    category: 'TECH_STACK',
    subcategory: 'COMPUTER_VISION',
    description: 'Open-source computer vision library',
    isAISkill: true,
  },
  {
    name: 'YOLO',
    category: 'TECH_STACK',
    subcategory: 'COMPUTER_VISION',
    description: 'Real-time object detection',
    isAISkill: true,
  },
  {
    name: 'Detectron2',
    category: 'TECH_STACK',
    subcategory: 'COMPUTER_VISION',
    description: 'Facebook AI Research object detection',
    isAISkill: true,
  },
  {
    name: 'MMDetection',
    category: 'TECH_STACK',
    subcategory: 'COMPUTER_VISION',
    description: 'OpenMMLab detection toolbox',
    isAISkill: true,
  },
];

// NLP Libraries
const NLP_LIBRARIES = [
  {
    name: 'spaCy',
    category: 'TECH_STACK',
    subcategory: 'NLP',
    description: 'Industrial-strength NLP library',
    isAISkill: true,
  },
  {
    name: 'NLTK',
    category: 'TECH_STACK',
    subcategory: 'NLP',
    description: 'Natural Language Toolkit',
    isAISkill: true,
  },
  {
    name: 'Transformers',
    category: 'TECH_STACK',
    subcategory: 'NLP',
    description: 'State-of-the-art NLP models',
    isAISkill: true,
  },
  {
    name: 'Sentence-BERT',
    category: 'TECH_STACK',
    subcategory: 'NLP',
    description: 'Sentence embeddings',
    isAISkill: true,
  },
];

// MLOps Tools
const MLOPS_TOOLS = [
  {
    name: 'MLflow',
    category: 'TECH_STACK',
    subcategory: 'MLOPS',
    description: 'ML lifecycle management platform',
    isAISkill: true,
  },
  {
    name: 'Weights & Biases',
    category: 'TECH_STACK',
    subcategory: 'MLOPS',
    description: 'Experiment tracking and model monitoring',
    isAISkill: true,
  },
  {
    name: 'Kubeflow',
    category: 'TECH_STACK',
    subcategory: 'MLOPS',
    description: 'ML toolkit for Kubernetes',
    isAISkill: true,
  },
  {
    name: 'BentoML',
    category: 'TECH_STACK',
    subcategory: 'MLOPS',
    description: 'Unified model serving framework',
    isAISkill: true,
  },
  {
    name: 'TFX',
    category: 'TECH_STACK',
    subcategory: 'MLOPS',
    description: 'TensorFlow Extended for production ML',
    isAISkill: true,
  },
];

// Cloud AI Platforms
const CLOUD_AI_PLATFORMS = [
  {
    name: 'AWS SageMaker',
    category: 'TECH_STACK',
    subcategory: 'CLOUD_AI',
    description: 'Amazon ML platform',
    isAISkill: true,
  },
  {
    name: 'Google Vertex AI',
    category: 'TECH_STACK',
    subcategory: 'CLOUD_AI',
    description: 'Google Cloud ML platform',
    isAISkill: true,
  },
  {
    name: 'Azure ML',
    category: 'TECH_STACK',
    subcategory: 'CLOUD_AI',
    description: 'Microsoft Azure ML services',
    isAISkill: true,
  },
  {
    name: 'Databricks',
    category: 'TECH_STACK',
    subcategory: 'CLOUD_AI',
    description: 'Unified analytics platform',
    isAISkill: true,
  },
];

// Vector Databases
const VECTOR_DATABASES = [
  {
    name: 'Pinecone',
    category: 'TECH_STACK',
    subcategory: 'VECTOR_DB',
    description: 'Managed vector database',
    isAISkill: true,
  },
  {
    name: 'Weaviate',
    category: 'TECH_STACK',
    subcategory: 'VECTOR_DB',
    description: 'Open-source vector database',
    isAISkill: true,
  },
  {
    name: 'Milvus',
    category: 'TECH_STACK',
    subcategory: 'VECTOR_DB',
    description: 'Vector database for AI applications',
    isAISkill: true,
  },
  {
    name: 'Qdrant',
    category: 'TECH_STACK',
    subcategory: 'VECTOR_DB',
    description: 'Vector similarity search engine',
    isAISkill: true,
  },
  {
    name: 'ChromaDB',
    category: 'TECH_STACK',
    subcategory: 'VECTOR_DB',
    description: 'Embedding database for LLM apps',
    isAISkill: true,
  },
];

// Programming Languages
const PROGRAMMING_LANGUAGES = [
  {
    name: 'Python',
    category: 'TECH_STACK',
    subcategory: 'LANGUAGE',
    description: 'Primary language for ML/AI development',
    isAISkill: true,
  },
  {
    name: 'R',
    category: 'TECH_STACK',
    subcategory: 'LANGUAGE',
    description: 'Statistical computing and data analysis',
    isAISkill: true,
  },
  {
    name: 'Julia',
    category: 'TECH_STACK',
    subcategory: 'LANGUAGE',
    description: 'High-performance scientific computing',
    isAISkill: true,
  },
  {
    name: 'Scala',
    category: 'TECH_STACK',
    subcategory: 'LANGUAGE',
    description: 'For Apache Spark and big data ML',
    isAISkill: true,
  },
  {
    name: 'Java',
    category: 'TECH_STACK',
    subcategory: 'LANGUAGE',
    description: 'Enterprise ML applications',
    isAISkill: true,
  },
];

// Data Processing
const DATA_PROCESSING = [
  {
    name: 'Pandas',
    category: 'TECH_STACK',
    subcategory: 'DATA_PROCESSING',
    description: 'Data manipulation and analysis',
    isAISkill: true,
  },
  {
    name: 'NumPy',
    category: 'TECH_STACK',
    subcategory: 'DATA_PROCESSING',
    description: 'Numerical computing',
    isAISkill: true,
  },
  {
    name: 'Apache Spark',
    category: 'TECH_STACK',
    subcategory: 'DATA_PROCESSING',
    description: 'Big data processing',
    isAISkill: true,
  },
  {
    name: 'Dask',
    category: 'TECH_STACK',
    subcategory: 'DATA_PROCESSING',
    description: 'Parallel computing library',
    isAISkill: true,
  },
];

// Soft Skills
const SOFT_SKILLS = [
  {
    name: 'Technical Communication',
    category: 'SOFT_SKILL',
    subcategory: undefined,
    description: 'Explaining complex AI concepts to non-technical stakeholders',
    isAISkill: false,
  },
  {
    name: 'Problem Solving',
    category: 'SOFT_SKILL',
    subcategory: undefined,
    description: 'Analytical and critical thinking',
    isAISkill: false,
  },
  {
    name: 'Project Management',
    category: 'SOFT_SKILL',
    subcategory: undefined,
    description: 'Managing AI/ML projects and timelines',
    isAISkill: false,
  },
  {
    name: 'Stakeholder Management',
    category: 'SOFT_SKILL',
    subcategory: undefined,
    description: 'Managing expectations and requirements',
    isAISkill: false,
  },
  {
    name: 'Team Leadership',
    category: 'SOFT_SKILL',
    subcategory: undefined,
    description: 'Leading technical teams',
    isAISkill: false,
  },
];

async function seedAISkills() {
  console.log('🌱 Seeding AI Skills Taxonomy...\n');

  const allSkills = [
    ...AI_SPECIALIZATIONS,
    ...ML_FRAMEWORKS,
    ...LLM_TOOLS,
    ...CV_LIBRARIES,
    ...NLP_LIBRARIES,
    ...MLOPS_TOOLS,
    ...CLOUD_AI_PLATFORMS,
    ...VECTOR_DATABASES,
    ...PROGRAMMING_LANGUAGES,
    ...DATA_PROCESSING,
    ...SOFT_SKILLS,
  ];

  let created = 0;
  let skipped = 0;

  for (const skill of allSkills) {
    try {
      await prisma.skill.upsert({
        where: { name: skill.name },
        update: {
          category: skill.category,
          subcategory: skill.subcategory,
          description: skill.description,
          isAISkill: skill.isAISkill,
        },
        create: skill,
      });
      created++;
      console.log(`✅ ${skill.name} (${skill.category})`);
    } catch (error) {
      skipped++;
      console.log(`⚠️  Skipped ${skill.name}: ${error}`);
    }
  }

  console.log(`\n✨ Seed complete!`);
  console.log(`   Created/Updated: ${created} skills`);
  console.log(`   Skipped: ${skipped} skills`);
  console.log(`\nBreakdown:`);
  console.log(`   🎯 AI Specializations: ${AI_SPECIALIZATIONS.length}`);
  console.log(`   🛠️  Tech Stack: ${ML_FRAMEWORKS.length + LLM_TOOLS.length + CV_LIBRARIES.length + NLP_LIBRARIES.length + MLOPS_TOOLS.length + CLOUD_AI_PLATFORMS.length + VECTOR_DATABASES.length + PROGRAMMING_LANGUAGES.length + DATA_PROCESSING.length}`);
  console.log(`   💡 Soft Skills: ${SOFT_SKILLS.length}`);
  console.log(`   📊 Total: ${allSkills.length}`);
}

// Run the seed
seedAISkills()
  .catch((e) => {
    console.error('❌ Error seeding AI skills:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
