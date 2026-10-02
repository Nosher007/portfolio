import {
  SiPython, SiJavascript, SiGnubash, SiLangchain, SiOpenai, SiGooglegemini,
  SiFastapi, SiDocker, SiGit, SiGithubactions, SiPytest, SiApacheairflow,
  SiGooglecloud, SiGooglebigquery, SiPytorch, SiScikitlearn,
} from 'react-icons/si'
import { FaDatabase } from 'react-icons/fa'
import { TbApi, TbVectorTriangle, TbShieldCheck, TbChartLine, TbGitMerge } from 'react-icons/tb'
import type { SkillGroup } from '../types'

export const skillGroups: SkillGroup[] = [
  {
    label: 'AI & LLM',
    blurb: 'Agents, retrieval, tuning and the evaluation that keeps them honest.',
    wide: true,
    skills: [
      { name: 'LangGraph', Icon: TbGitMerge },
      { name: 'LangChain', Icon: SiLangchain },
      { name: 'RAG' },
      { name: 'Embeddings', Icon: TbVectorTriangle },
      { name: 'ChromaDB' },
      { name: 'Prompt Engineering' },
      { name: 'PEFT / LoRA' },
      { name: 'Evaluation Frameworks' },
      { name: 'Guardrails', Icon: TbShieldCheck },
      { name: 'Gemini', Icon: SiGooglegemini },
      { name: 'OpenAI', Icon: SiOpenai },
    ],
  },
  {
    label: 'Languages',
    blurb: 'What I write every day.',
    skills: [
      { name: 'Python', Icon: SiPython },
      { name: 'JavaScript', Icon: SiJavascript },
      { name: 'SQL', Icon: FaDatabase },
      { name: 'Shell', Icon: SiGnubash },
    ],
  },
  {
    label: 'Cloud & ML',
    blurb: 'Training, serving and watching models in production.',
    skills: [
      { name: 'GCP', Icon: SiGooglecloud },
      { name: 'Vertex AI' },
      { name: 'Cloud Run' },
      { name: 'BigQuery', Icon: SiGooglebigquery },
      { name: 'PyTorch', Icon: SiPytorch },
      { name: 'scikit-learn', Icon: SiScikitlearn },
      { name: 'Observability', Icon: TbChartLine },
      { name: 'Drift Detection' },
    ],
  },
  {
    label: 'Engineering',
    blurb: 'Shipping services that are tested, reviewed and reliable.',
    wide: true,
    skills: [
      { name: 'FastAPI', Icon: SiFastapi },
      { name: 'REST APIs', Icon: TbApi },
      { name: 'Docker', Icon: SiDocker },
      { name: 'Git', Icon: SiGit },
      { name: 'GitHub Actions', Icon: SiGithubactions },
      { name: 'pytest', Icon: SiPytest },
      { name: 'Airflow', Icon: SiApacheairflow },
      { name: 'Code Reviews' },
    ],
  },
]
