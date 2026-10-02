import type { IconType } from 'react-icons'

export interface SkillGroup {
  label: string
  blurb: string
  skills: { name: string; Icon?: IconType }[]
  /** Spans two columns in the bento grid on large screens */
  wide?: boolean
}

export interface Experience {
  title: string
  company: string
  location: string
  startDate: string
  endDate: string
  bullets: string[]
  metrics: string[]
}

export interface Project {
  number: string
  title: string
  kind: string
  tags: string[]
  description: string
  highlights?: string[]
  githubUrl?: string
  liveUrl?: string
  image?: string
  featured?: boolean
}
