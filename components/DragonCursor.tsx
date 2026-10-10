'use client'

import { useEffect, useRef, useSyncExternalStore } from 'react'

const SEGMENT_COUNT = 34
const VIEWBOX_WIDTH = 1200
const VIEWBOX_HEIGHT = 620

const subscribeToReducedMotion = (callback: () => void) => {
  const query = matchMedia('(prefers-reduced-motion: reduce)')
  query.addEventListener('change', callback)
  return () => query.removeEventListener('change', callback)
}

const getReducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches

type Point = { x: number; y: number }

export default function DragonCursor() {
  const segmentRefs = useRef<Array<SVGUseElement | null>>([])
  const svgRef = useRef<SVGSVGElement>(null)
  const reducedMotion = useSyncExternalStore(subscribeToReducedMotion, getReducedMotion, () => true)

  useEffect(() => {
    if (reducedMotion) return

    const points: Point[] = Array.from({ length: SEGMENT_COUNT }, (_, index) => ({
      x: VIEWBOX_WIDTH * 0.77 - index * 22,
      y: VIEWBOX_HEIGHT * 0.42,
    }))
    const pointer = { x: VIEWBOX_WIDTH * 0.77, y: VIEWBOX_HEIGHT * 0.42 }
    let lastPointerMove = performance.now()
    let frame = 0
    let phase = Math.random() * Math.PI * 2

    const trackPointer = (event: PointerEvent) => {
      const rect = svgRef.current?.getBoundingClientRect()
      if (!rect?.width || !rect.height) return
      pointer.x = ((event.clientX - rect.left) / rect.width) * VIEWBOX_WIDTH
      pointer.y = ((event.clientY - rect.top) / rect.height) * VIEWBOX_HEIGHT
      lastPointerMove = performance.now()
    }

    const animate = (time: number) => {
      const idle = time - lastPointerMove > 1300
      const targetX = idle ? VIEWBOX_WIDTH * 0.62 + Math.cos(phase * 1.7) * 250 : pointer.x
      const targetY = idle ? VIEWBOX_HEIGHT * 0.45 + Math.sin(phase * 2.1) * 145 : pointer.y
      points[0].x += (targetX - points[0].x) * 0.105
      points[0].y += (targetY - points[0].y) * 0.105

      for (let index = 1; index < SEGMENT_COUNT; index += 1) {
        const current = points[index]
        const previous = points[index - 1]
        const angle = Math.atan2(current.y - previous.y, current.x - previous.x)
        const spacing = Math.max(8, 29 - index * 0.48)
        const targetSegmentX = previous.x + Math.cos(angle) * spacing
        const targetSegmentY = previous.y + Math.sin(angle) * spacing
        current.x += (targetSegmentX - current.x) * 0.38
        current.y += (targetSegmentY - current.y) * 0.38
      }

      segmentRefs.current.forEach((element, index) => {
        if (!element) return
        const current = points[index]
        const next = points[Math.min(index + 1, SEGMENT_COUNT - 1)]
        const angle = Math.atan2(current.y - next.y, current.x - next.x) * (180 / Math.PI)
        const scale = 1.08 - index * 0.018
        const wave = Math.sin(phase * 2.2 - index * 0.42) * Math.min(index * 0.28, 4.5)
        element.setAttribute(
          'transform',
          `translate(${current.x.toFixed(2)} ${(current.y + wave).toFixed(2)}) rotate(${angle.toFixed(2)}) scale(${Math.max(scale, 0.48).toFixed(3)})`,
        )
        element.style.opacity = String(Math.max(0.18, 0.9 - index * 0.019))
      })

      phase += 0.006
      frame = requestAnimationFrame(animate)
    }

    window.addEventListener('pointermove', trackPointer, { passive: true })
    frame = requestAnimationFrame(animate)
    return () => {
      window.removeEventListener('pointermove', trackPointer)
      cancelAnimationFrame(frame)
    }
  }, [reducedMotion])

  return (
    <svg
      ref={svgRef}
      className="dragon-cursor"
      viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="dragon-bone" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--sigil-white)" />
          <stop offset=".48" stopColor="var(--sigil-cold)" />
          <stop offset="1" stopColor="var(--sigil-hot)" />
        </linearGradient>
        <filter id="dragon-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <g id="dragon-head" className="dragon-bone dragon-head">
          <path d="M-50 0-31-12-39-31-13-23 2-34 11-17 35-12 52 0 35 12 11 17 2 34-13 23-39 31-31 12Z" />
          <path d="M-31-12-56-55-12-29M-31 12-56 55-12 29M2-34 22-54 16-23M2 34l20 20-6-31" />
          <path d="M-18-8 4 0-18 8M3-9 36-5 49 0 36 5 3 9M-30 0H42" />
          <path d="m-9-22-8 22 8 22M20-13 30 0 20 13" className="dragon-sigil-line" />
          <circle cx="12" cy="-8" r="3.6" className="dragon-eye" />
          <circle cx="12" cy="8" r="3.6" className="dragon-eye dragon-eye-dim" />
          <path d="m34-6 9-13-1 16M34 6l9 13-1-16" />
        </g>
        <g id="dragon-vertebra" className="dragon-bone dragon-vertebra">
          <path d="M-20 0-9-8 0-4 9-8 20 0 9 8 0 4-9 8Z" />
          <path d="M-11-7-5-24 1-8 8-19 11-5M-11 7-5 24 1 8 8 19 11 5" />
          <path d="m-4-11 4 7 4-7M-4 11l4-7 4 7" className="dragon-sigil-line" />
          <circle cx="0" cy="0" r="2.8" />
        </g>
        <g id="dragon-rib" className="dragon-bone dragon-rib">
          <path d="M-20 0-9-8 0-4 9-8 20 0 9 8 0 4-9 8Z" />
          <path d="M-8-6-24-27-51-31-34-42M0-7-10-42-34-59-22-34M8-6 7-35-9-64" />
          <path d="M-8 6-24 27-51 31-34 42M0 7-10 42-34 59-22 34M8 6 7 35-9 64" />
          <path d="M-51-31-34-59-9-64M-51 31-34 59-9 64" className="dragon-membrane" />
        </g>
        <g id="dragon-wing" className="dragon-bone dragon-wing">
          <path d="M16 0-7-34-55-77M9-3-34-91-108-112M2 0-64-67-128-57M-6 5-69-29-120 7" />
          <path d="M-55-77-108-112-128-57-120 7M16 0-55-77M16 0-128-57M16 0-120 7" className="dragon-membrane" />
          <path d="m-108-112 14 29-34 26 31 8-23 36M-16 0-7-10 6-7 18 0 6 7-7 10Z" />
          <path d="M-44-63-35-45-64-39M-82-84-71-64-99-59" className="dragon-sigil-line" />
        </g>
        <g id="dragon-tail" className="dragon-bone dragon-tail">
          <path d="M-21 0-7-7 7 0-7 7Z" />
          <path d="M-9-5-3-20 2-6M-9 5-3 20 2 6M7 0l17-12-7 12 7 12Z" />
        </g>
      </defs>
      <g className="dragon-chain">
        {Array.from({ length: SEGMENT_COUNT }, (_, index) => {
          const part = index === 0 ? 'dragon-head' : index === 7 || index === 13 ? 'dragon-wing' : index < 19 && index % 3 === 0 ? 'dragon-rib' : index > 28 ? 'dragon-tail' : 'dragon-vertebra'
          const initialX = VIEWBOX_WIDTH * 0.77 - index * 22
          return (
            <use
              key={index}
              ref={(element) => { segmentRefs.current[index] = element }}
              href={`#${part}`}
              transform={`translate(${initialX} ${VIEWBOX_HEIGHT * 0.42}) scale(${Math.max(1.08 - index * 0.018, 0.48)})`}
            />
          )
        })}
      </g>
    </svg>
  )
}
