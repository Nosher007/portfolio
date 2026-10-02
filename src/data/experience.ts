import type { Experience } from '../types'

export const experiences: Experience[] = [
  {
    title: 'Machine Learning Engineer Co-op',
    company: 'URBN (Urban Outfitters, Inc.)',
    location: 'Philadelphia, PA',
    startDate: 'Sep 2025',
    endDate: 'Mar 2026',
    metrics: ['7 production ML systems', '~70% less manual intervention', 'GCP · Vertex AI · Cloud Run'],
    bullets: [
      'Deployed and monitored ML services across 7 production systems on GCP, serving real-time inference through FastAPI on Cloud Run with observability, drift detection, and performance monitoring.',
      'Fine-tuned transformer models in PyTorch on Vertex AI and built the embedding generation and inference paths behind them.',
      'Built Airflow pipelines with schema-validation gates for data quality, running ingestion, evaluation, deployment, and drift-triggered retraining, and cut manual intervention by roughly 70%.',
      'Wrote operational runbooks for pipeline failures and maintained CI/CD with automated tests to improve reliability.',
      'Worked with data scientists and product stakeholders to turn requirements into technical designs, and explained model tradeoffs and success metrics to non-technical audiences.',
    ],
  },
  {
    title: 'Associate Software Engineer',
    company: 'Buggcy',
    location: 'Lahore, Pakistan',
    startDate: 'Jan 2023',
    endDate: 'Aug 2024',
    metrics: ['25+ services shipped', '4 client engagements', '15% lower API latency'],
    bullets: [
      'Shipped 25+ Python and JavaScript backend services and REST APIs across 4 client engagements, embedded end-to-end with each customer team from requirements through production.',
      'Contributed to architecture and code reviews, and wrote API documentation thorough enough for customer teams to onboard from specs alone.',
      'Cut API latency 15% through SQL query optimization, with enforced testing on every service.',
    ],
  },
]
