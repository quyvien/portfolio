import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import '../layout.css'
import '../motion.css'
import './three.css'

export const metadata: Metadata = {
  title: 'Quy Vien — Aspiring Software Engineer',
  description:
    'Quy Vien, a third-year Information Technology student at HUFLIT and aspiring Software Engineer. Explore my skills, projects, and contact details.',
  icons: { icon: '/assets/favicon.svg' },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  width: 'device-width',
  initialScale: 1,
}

const themeScript = `
try {
  const saved = localStorage.getItem('portfolio-theme');
  document.documentElement.dataset.theme = saved === 'light' || saved === 'dark'
    ? saved
    : matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
} catch {
  document.documentElement.dataset.theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}`

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
