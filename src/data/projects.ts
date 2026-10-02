import type { Project } from '../types'

import cybersentinelImg from '../assets/images/projects/cybersentinel.svg'
import peftImg from '../assets/images/projects/peft-research.svg'
import signbridgeImg from '../assets/images/projects/signbridge.svg'
import spendingChurnImg from '../assets/images/projects/spending-churn.svg'

export const projects: Project[] = [
  {
    number: '01',
    title: 'CyberSentinel',
    kind: 'Multi-agent LLM platform · Deployed',
    featured: true,
    tags: ['LangGraph', 'LangChain', 'RAG', 'ChromaDB', 'Docker', 'GCP Cloud Run'],
    description:
      'Production multi-agent platform that answers security questions via retrieval-augmented generation over live CVE/NVD data, deployed on GCP Cloud Run.',
    highlights: [
      '5-agent LangGraph and LangChain platform with routing and shared prompt templates and tool definitions',
      'RAG over live data: chunking, embeddings, and ChromaDB vector retrieval tuned for structured JSON output',
      '332-test evaluation suite scoring relevance, accuracy, and safety as a CI/CD release gate, plus latency and cost tracing',
    ],
    liveUrl: 'https://cybersentinel-prod.web.app',
    githubUrl: 'https://github.com/Nosher007/cybersentinel',
    image: cybersentinelImg,
  },
  {
    number: '02',
    title: 'Parameter-Efficient Fine-Tuning',
    kind: 'MS thesis research · Drexel, 2026',
    tags: ['LoRA', 'Adapters', 'Prefix Tuning', 'Flan-T5', 'Llama-3.2-3B'],
    description:
      'Benchmark study comparing LoRA, adapter, and prefix tuning against full fine-tuning of Flan-T5-base and Llama-3.2-3B on medical and legal QA, with reproducible evaluation that scores accuracy against parameter and compute cost.',
    image: peftImg,
  },
  {
    number: '03',
    title: 'SignBridge',
    kind: 'Real-time vision + LLM',
    tags: ['MobileNetV2', 'LSTM', 'LangChain', 'Gemini', 'GCP'],
    description:
      'Real-time ASL-to-English translation combining a MobileNetV2 + LSTM vision model with LangChain and Gemini for natural language output. Owned the data pipeline, LLM integration, UI, and Cloud Run deployment.',
    githubUrl: 'https://github.com/Nosher007/signbridge',
    image: signbridgeImg,
  },
  {
    number: '04',
    title: 'Spending & Churn Analysis',
    kind: 'Tabular ML · Academic',
    tags: ['XGBoost', 'LightGBM', 'PyTorch', 'PCA'],
    description:
      'End-to-end churn prediction and spending analysis on multi-source transactional data, comparing gradient-boosted classifiers and neural networks with PCA and per-class evaluation.',
    githubUrl: 'https://github.com/Nosher007',
    image: spendingChurnImg,
  },
]
