import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import type { ReactNode } from 'react'
import '../layout.css'
import '../motion.css'
import './three.css'

const inter = localFont({
  src: '../public/assets/inter-variable.ttf',
  display: 'swap',
  variable: '--font-inter',
  weight: '100 900',
})

const ibmPlexMono = localFont({
  src: '../public/assets/ibm-plex-mono-regular.ttf',
  display: 'swap',
  variable: '--font-ibm-plex-mono',
  weight: '400',
})

export const metadata: Metadata = {
  applicationName: 'Quy Vien Portfolio',
  title: {
    default: 'Quy Vien — Aspiring Software Engineer',
    template: '%s | Quy Vien',
  },
  description:
    'Quy Vien, a third-year Information Technology student at HUFLIT and aspiring Software Engineer. Explore my skills, projects, and contact details.',
  authors: [{ name: 'Quy Vien' }],
  creator: 'Quy Vien',
  keywords: ['Quy Vien', 'Software Engineer', 'Web Developer', 'HUFLIT', 'Portfolio'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Quy Vien — Aspiring Software Engineer',
    description:
      'Portfolio of Quy Vien, a third-year Information Technology student at HUFLIT and aspiring Software Engineer.',
    siteName: 'Quy Vien Portfolio',
  },
  twitter: {
    card: 'summary',
    title: 'Quy Vien — Aspiring Software Engineer',
    description:
      'Portfolio of Quy Vien, a third-year Information Technology student at HUFLIT and aspiring Software Engineer.',
  },
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
    <html lang="en" className={`${inter.variable} ${ibmPlexMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
