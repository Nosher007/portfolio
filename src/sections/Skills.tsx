import {
  SiPython, SiPytorch, SiScikitlearn, SiGooglecloud,
  SiDbt, SiApacheairflow, SiMlflow, SiDocker, SiFastapi, SiLangchain,
  SiGit, SiReact, SiTypescript,
} from 'react-icons/si'
import { FaDatabase, FaRobot, FaCloud } from 'react-icons/fa'
import { TbApi } from 'react-icons/tb'
import type { IconType } from 'react-icons'

type SkillEntry = { name: string; Icon: IconType }

const categories: { label: string; skills: SkillEntry[] }[] = [
  {
    label: 'ML & AI',
    skills: [
      { name: 'Python',      Icon: SiPython      },
      { name: 'PyTorch',     Icon: SiPytorch     },
      { name: 'Scikit-learn',Icon: SiScikitlearn },
      { name: 'LangChain',   Icon: SiLangchain   },
      { name: 'LangGraph',   Icon: FaRobot       },
    ],
  },
  {
    label: 'Data Engineering',
    skills: [
      { name: 'GCP',     Icon: SiGooglecloud  },
      { name: 'BigQuery',Icon: FaCloud        },
      { name: 'DBT',     Icon: SiDbt          },
      { name: 'Airflow', Icon: SiApacheairflow},
      { name: 'SQL',     Icon: FaDatabase     },
    ],
  },
  {
    label: 'MLOps & Infra',
    skills: [
      { name: 'MLflow',    Icon: SiMlflow  },
      { name: 'Docker',    Icon: SiDocker  },
      { name: 'FastAPI',   Icon: SiFastapi },
      { name: 'REST APIs', Icon: TbApi     },
    ],
  },
  {
    label: 'Software',
    skills: [
      { name: 'Git',        Icon: SiGit        },
      { name: 'TypeScript', Icon: SiTypescript },
      { name: 'React',      Icon: SiReact      },
    ],
  },
]

export default function Skills() {
  return (
    <section id="skills" className="py-20 lg:py-24 bg-white">
      <div className="max-w-content mx-auto px-6 lg:px-20">
        <h2 className="font-sora font-bold text-h1 text-black text-center mb-16">
          My{' '}
          <span className="relative inline-block">
            Skills
            <span className="absolute -bottom-1 left-0 right-0 h-[5px] bg-black rounded-full" />
          </span>
        </h2>

        <div className="flex flex-col gap-12">
          {categories.map((cat) => (
            <div key={cat.label}>
              <h3 className="font-sora font-semibold text-p3 text-zinc-500 uppercase tracking-widest mb-6">
                {cat.label}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {cat.skills.map((skill) => (
                  <div
                    key={skill.name}
                    className="border border-zinc-200 flex flex-col items-center justify-center gap-3 py-7 px-4 hover:border-black hover:shadow-md transition-all cursor-default group"
                  >
                    <div className="w-9 h-9 flex items-center justify-center">
                      <skill.Icon
                        size={36}
                        className="text-black group-hover:scale-110 transition-transform"
                      />
                    </div>
                    <span className="font-sora text-p3 font-medium text-black text-center">
                      {skill.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
