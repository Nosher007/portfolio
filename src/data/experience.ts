import type { Experience } from '../types'

export const experiences: Experience[] = [
  {
    title: 'ML Engineer Co-op',
    company: 'URBN',
    location: 'Philadelphia, PA',
    startDate: 'September 2025',
    endDate: 'March 2026',
    bullets: [
      'Built and maintained ML data pipelines on GCP using BigQuery, DBT, and Airflow',
      'Implemented drift detection and model monitoring for production ML systems',
      'Developed REST APIs to expose model outputs to downstream product teams',
    ],
  },
  {
    title: 'Junior Software Engineer',
    company: 'Buggcy',
    location: 'Remote',
    startDate: 'August 2023',
    endDate: 'August 2024',
    bullets: [
      'Built full-stack features and REST APIs across multiple client projects',
      'Worked on data-heavy features and performance optimization at scale',
    ],
  },
]
