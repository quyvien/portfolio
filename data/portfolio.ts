export type SkillGroup = {
  title: string
  shortLabel: string
  items: Array<{ mark: string; className: string; label: string }>
}

export type MentoringPhoto = {
  src: string
  alt: string
  caption: string
  note?: string
  main?: boolean
  width: number
  height: number
}

export const portfolio = {
  name: 'Quy Vien',
  intro:
    'Third-year Information Technology student aspiring to become a Software Engineer. I enjoy building practical software projects, learning new technologies, and improving my development skills through university projects and self-learning.',
  email: 'quyviensv1@gmail.com',
  github: 'https://github.com/quyvien',
} as const

export const navigation = [
  ['01', 'About', 'about'],
  ['02', 'Skills', 'skills'],
  ['03', 'Projects', 'projects'],
  ['04', 'Mentoring', 'mentoring'],
  ['05', 'Contact', 'contact'],
] as const

export const skillGroups: SkillGroup[] = [
  {
    title: 'Programming Languages',
    shortLabel: 'code',
    items: [
      { mark: 'C#', className: 'csharp', label: 'C#' },
      { mark: 'SQL', className: 'sql', label: 'SQL' },
      { mark: 'K', className: 'kotlin', label: 'Kotlin' },
    ],
  },
  {
    title: 'Web Development',
    shortLabel: 'web',
    items: [
      { mark: '.N', className: 'dotnet', label: 'ASP.NET MVC' },
      { mark: '5', className: 'html', label: 'HTML' },
      { mark: '#', className: 'css', label: 'CSS' },
      { mark: 'JS', className: 'javascript', label: 'JavaScript' },
      { mark: 'TS', className: 'typescript', label: 'TypeScript' },
      { mark: 'N', className: 'nextjs', label: 'Next.js' },
    ],
  },
  {
    title: 'Database',
    shortLabel: 'data',
    items: [
      { mark: 'DB', className: 'sqlserver', label: 'SQL Server' },
      { mark: 'O', className: 'oracle', label: 'Oracle' },
      { mark: 'PL', className: 'plsql', label: 'PL/SQL' },
      { mark: 'R', className: 'redis', label: 'Redis' },
      { mark: 'F', className: 'firebase', label: 'Firebase Realtime Database' },
    ],
  },
  {
    title: 'Software Development',
    shortLabel: 'system',
    items: [
      { mark: 'OOP', className: 'oop', label: 'Object-Oriented Programming' },
      { mark: 'MVC', className: 'mvc', label: 'MVC Architecture' },
      { mark: 'API', className: 'rest', label: 'REST concepts' },
      { mark: 'ER', className: 'design', label: 'Database Design' },
      { mark: 'SA', className: 'analysis', label: 'Software Analysis and Design' },
      { mark: 'SE', className: 'engineering', label: 'Software Engineering fundamentals' },
    ],
  },
  {
    title: 'Tools',
    shortLabel: 'tools',
    items: [
      { mark: 'G', className: 'git', label: 'Git' },
      { mark: 'GH', className: 'github', label: 'GitHub' },
      { mark: 'VS', className: 'visualstudio', label: 'Visual Studio' },
      { mark: '<>', className: 'vscode', label: 'VS Code' },
      { mark: 'A', className: 'android', label: 'Android Studio' },
      { mark: 'Db', className: 'dbeaver', label: 'DBeaver' },
      { mark: 'UML', className: 'staruml', label: 'StarUML' },
      { mark: 'PU', className: 'plantuml', label: 'PlantUML' },
      { mark: 'M', className: 'mermaid', label: 'Mermaid' },
    ],
  },
]

export const mentoringPhotos: MentoringPhoto[] = [
  {
    src: '/assets/huflit-first-interview.jpg',
    alt: 'My first HUFLIT Mentoring interview, with a mentor reviewing documents across a classroom desk',
    caption: '01 / HUFLIT MENTORING',
    note: 'My First Interview',
    main: true,
    width: 2048,
    height: 1365,
  },
  {
    src: '/assets/huflit-mentoring-02.jpg',
    alt: 'Two participants meeting at a café as part of HUFLIT Mentoring',
    caption: '02 / SHARED MOMENTS',
    width: 960,
    height: 540,
  },
  {
    src: '/assets/huflit-mentoring-03.jpg',
    alt: 'Two participants with handwritten notes at a HUFLIT Mentoring meeting',
    caption: '03 / THE MENTORING JOURNEY',
    width: 960,
    height: 540,
  },
  {
    src: '/assets/huflit-mentoring-04.jpg',
    alt: 'Participants talking during a HUFLIT Mentoring event',
    caption: '04 / MENTORING CONVERSATIONS',
    width: 2048,
    height: 1365,
  },
  {
    src: '/assets/huflit-mentoring-05.jpg',
    alt: 'Participants holding certificates at the HUFLIT Mentoring season one closing ceremony',
    caption: '05 / SEASON ONE CLOSING CEREMONY',
    width: 2048,
    height: 1365,
  },
]
