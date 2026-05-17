export interface Skill {
  name: string
  icon: string
  category: 'ml-ai' | 'data-eng' | 'mlops' | 'software'
}

export interface Experience {
  title: string
  company: string
  location: string
  startDate: string
  endDate: string
  bullets: string[]
}

export interface Project {
  number: string
  title: string
  tags: string[]
  description: string
  githubUrl?: string
  liveUrl?: string
  image?: string
}
