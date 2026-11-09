import type { OpenSourceProject } from '../types'

/** Your GitHub username: only PRs you authored are listed */
export const GITHUB_USER = 'Nosher007'

/**
 * Projects you contribute to. Add a repo here and its card fills in from
 * GitHub on its own; the snapshot is what shows if GitHub can't be reached.
 */
export const OPEN_SOURCE: OpenSourceProject[] = [
  {
    owner: 'gosha70',
    repo: 'code-copilot-team',
    role: 'Contributor',
    snapshot: {
      url: 'https://github.com/gosha70/code-copilot-team',
      description:
        'An enforceable harness for AI-assisted coding: your rules, your workflow and your safety rails, applied the same way by every coding agent you use.',
      stars: 9,
      forks: 6,
      release: 'v2.0.0',
      license: 'MIT',
      totalMerged: 4,
      asOf: '2026-11-09',
      prs: [
        {
          number: 436,
          title: 'fix(graph): pass the COPY path to Kuzu as as_posix() so the graph builds on Windows',
          url: 'https://github.com/gosha70/code-copilot-team/pull/436',
          mergedAt: '2026-11-08T22:58:36Z',
          additions: 31,
          deletions: 1,
          commits: 1,
        },
        {
          number: 435,
          title: 'feat(session-analytics): `gaps` reports inter-turn gaps and active hours by cutoff',
          url: 'https://github.com/gosha70/code-copilot-team/pull/435',
          mergedAt: '2026-11-08T22:58:09Z',
          additions: 490,
          deletions: 0,
          commits: 4,
        },
        {
          number: 432,
          title: 'test: one packaged_config() helper isolates all three config inputs',
          url: 'https://github.com/gosha70/code-copilot-team/pull/432',
          mergedAt: '2026-11-08T20:21:48Z',
          additions: 102,
          deletions: 33,
          commits: 2,
        },
        {
          number: 426,
          title: 'test(api): isolate test_get_config from the worktree .env',
          url: 'https://github.com/gosha70/code-copilot-team/pull/426',
          mergedAt: '2026-11-08T17:44:38Z',
          additions: 10,
          deletions: 1,
          commits: 2,
        },
      ],
    },
  },
]
