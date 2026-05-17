import type { Skill } from '../types'

export const skills: Skill[] = [
  // ML & AI
  { name: 'Python', icon: 'python', category: 'ml-ai' },
  { name: 'PyTorch', icon: 'pytorch', category: 'ml-ai' },
  { name: 'Scikit-learn', icon: 'scikitlearn', category: 'ml-ai' },
  { name: 'XGBoost', icon: 'xgboost', category: 'ml-ai' },
  { name: 'LangChain', icon: 'langchain', category: 'ml-ai' },
  { name: 'LangGraph', icon: 'langgraph', category: 'ml-ai' },

  // Data Engineering
  { name: 'GCP', icon: 'gcp', category: 'data-eng' },
  { name: 'BigQuery', icon: 'bigquery', category: 'data-eng' },
  { name: 'DBT', icon: 'dbt', category: 'data-eng' },
  { name: 'Airflow', icon: 'airflow', category: 'data-eng' },
  { name: 'SQL', icon: 'sql', category: 'data-eng' },

  // MLOps & Infra
  { name: 'MLflow', icon: 'mlflow', category: 'mlops' },
  { name: 'Docker', icon: 'docker', category: 'mlops' },
  { name: 'Cloud Run', icon: 'cloudrun', category: 'mlops' },
  { name: 'REST APIs', icon: 'api', category: 'mlops' },

  // Software
  { name: 'Git', icon: 'git', category: 'software' },
  { name: 'FastAPI', icon: 'fastapi', category: 'software' },
  { name: 'TypeScript', icon: 'typescript', category: 'software' },
  { name: 'React', icon: 'react', category: 'software' },
]
