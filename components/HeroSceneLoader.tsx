'use client'

import dynamic from 'next/dynamic'
import { HeroFallback } from './HeroFallback'

const DragonCursor = dynamic(() => import('./DragonCursor'), {
  ssr: false,
  loading: () => <HeroFallback />,
})

export function HeroSceneLoader() {
  return <DragonCursor />
}
