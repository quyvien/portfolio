'use client'

import { Float, Sparkles } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useState, useSyncExternalStore } from 'react'
import type { Group, Mesh } from 'three'
import { HeroFallback } from './HeroFallback'

const subscribeToReducedMotion = (callback: () => void) => {
  const query = matchMedia('(prefers-reduced-motion: reduce)')
  query.addEventListener('change', callback)
  return () => query.removeEventListener('change', callback)
}

const getReducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches

function Sculpture() {
  const group = useRef<Group>(null)
  const core = useRef<Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state, delta) => {
    if (!group.current || !core.current) return
    const targetX = state.pointer.y * 0.22
    const targetY = state.pointer.x * 0.34
    group.current.rotation.x += (targetX - group.current.rotation.x) * Math.min(delta * 3.5, 1)
    group.current.rotation.y += (targetY - group.current.rotation.y) * Math.min(delta * 3.5, 1)
    core.current.rotation.z += delta * (hovered ? 0.42 : 0.16)
  })

  return (
    <group ref={group}>
      <Float speed={1.35} rotationIntensity={0.35} floatIntensity={0.45}>
        <mesh
          ref={core}
          onPointerEnter={(event) => { event.stopPropagation(); setHovered(true) }}
          onPointerLeave={() => setHovered(false)}
          scale={hovered ? 1.05 : 1}
        >
          <torusKnotGeometry args={[1.02, 0.28, 180, 22, 2, 3]} />
          <meshStandardMaterial color="#d6cfb7" metalness={0.7} roughness={0.24} />
        </mesh>
        <mesh rotation={[0.4, 0.2, 0.3]} scale={1.62}>
          <icosahedronGeometry args={[1, 2]} />
          <meshBasicMaterial color="#81745b" wireframe transparent opacity={0.42} />
        </mesh>
      </Float>
      <Sparkles count={46} scale={4.6} size={2} speed={0.22} color="#f5efe0" opacity={0.55} />
    </group>
  )
}

export default function HeroScene() {
  const reducedMotion = useSyncExternalStore(subscribeToReducedMotion, getReducedMotion, () => true)

  if (reducedMotion) return <HeroFallback />

  return (
    <div className="hero-scene" role="img" aria-label="Interactive three-dimensional orbital sculpture">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 5.25], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        fallback={<HeroFallback />}
      >
        <ambientLight intensity={1.1} />
        <directionalLight position={[3, 4, 5]} intensity={3.2} color="#fff7e8" />
        <pointLight position={[-3, -2, 2]} intensity={8} color="#75644b" />
        <Sculpture />
      </Canvas>
    </div>
  )
}
