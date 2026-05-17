import type { Project } from '../types'

import cybersentinelImg from '../assets/images/projects/cybersentinel.svg'
import signbridgeImg from '../assets/images/projects/signbridge.svg'
import spendingChurnImg from '../assets/images/projects/spending-churn.svg'

export const projects: Project[] = [
  {
    number: '01',
    title: 'CyberSentinel',
    tags: ['LangGraph', 'RAG', 'GCP', 'Python', 'Cloud Run'],
    description:
      'A 5-agent autonomous security platform that ingests CVE data, performs RAG-based analysis, and generates remediation reports. Deployed on Cloud Run with 332 automated tests.',
    githubUrl: 'https://github.com/Nosher007',
    image: cybersentinelImg,
  },
  {
    number: '02',
    title: 'SignBridge',
    tags: ['MobileNetV2', 'LSTM', 'LangChain', 'Gemini 1.5', 'GCP'],
    description:
      'Real-time ASL-to-English translation system combining a MobileNetV2+LSTM vision model with LangChain and Gemini 1.5 for natural language output. Owns data pipeline, LLM integration, UI, and Cloud Run deployment.',
    githubUrl: 'https://github.com/Nosher007',
    image: signbridgeImg,
  },
  {
    number: '03',
    title: 'Spending & Churn Analysis',
    tags: ['XGBoost', 'PCA', 'Neural Networks', 'Python'],
    description:
      'End-to-end ML pipeline for customer churn prediction and spending pattern analysis using XGBoost, dimensionality reduction via PCA, and neural network classifiers.',
    githubUrl: 'https://github.com/Nosher007',
    image: spendingChurnImg,
  },
]
