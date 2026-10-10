'use client'

import { Sparkles } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useSyncExternalStore } from 'react'
import { MeshStandardMaterial, Quaternion, Vector3 } from 'three'
import type { Group, Material } from 'three'
import { HeroFallback } from './HeroFallback'

type Point = [number, number, number]

const subscribeToReducedMotion = (callback: () => void) => {
  const query = matchMedia('(prefers-reduced-motion: reduce)')
  query.addEventListener('change', callback)
  return () => query.removeEventListener('change', callback)
}

const getReducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches

function Bone({ start, end, radius = 0.035, material }: { start: Point; end: Point; radius?: number; material: Material }) {
  const transform = useMemo(() => {
    const from = new Vector3(...start)
    const to = new Vector3(...end)
    const direction = to.clone().sub(from)
    const midpoint = from.clone().add(to).multiplyScalar(0.5)
    const quaternion = new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), direction.clone().normalize())
    return { midpoint, quaternion, length: direction.length() }
  }, [start, end])

  return (
    <mesh position={transform.midpoint} quaternion={transform.quaternion} material={material}>
      <cylinderGeometry args={[radius * 0.72, radius, transform.length, 6]} />
    </mesh>
  )
}

const spine: Point[] = [
  [-2.45, -0.45, -0.08], [-2.12, -0.3, 0], [-1.78, -0.08, 0.05], [-1.4, 0.12, 0.06],
  [-0.98, 0.2, 0.04], [-0.54, 0.16, 0], [-0.08, 0.04, -0.02], [0.36, -0.02, 0],
  [0.75, 0.08, 0.03], [1.08, 0.29, 0.03], [1.34, 0.5, 0],
]

const wingBones: Array<[Point, Point]> = [
  [[-0.62, 0.23, 0], [-1.08, 1.08, -0.02]],
  [[-1.08, 1.08, -0.02], [-1.88, 1.42, 0]],
  [[-1.08, 1.08, -0.02], [-1.66, 0.72, 0]],
  [[-1.66, 0.72, 0], [-2.18, 0.34, 0]],
  [[0.1, 0.08, -0.02], [0.34, 1.0, 0]],
  [[0.34, 1.0, 0], [1.05, 1.4, 0]],
  [[0.34, 1.0, 0], [0.92, 0.74, 0]],
  [[0.92, 0.74, 0], [1.38, 0.42, 0]],
]

function DragonSkeleton() {
  const rig = useRef<Group>(null)
  const body = useRef<Group>(null)
  const cursor = useRef({ x: 0, y: 0 })
  const boneMaterial = useMemo(
    () => new MeshStandardMaterial({ color: '#ddd5bf', roughness: 0.58, metalness: 0.08 }),
    [],
  )
  const darkBoneMaterial = useMemo(
    () => new MeshStandardMaterial({ color: '#9b927d', roughness: 0.72, metalness: 0.05 }),
    [],
  )

  useEffect(() => {
    const trackPointer = (event: PointerEvent) => {
      cursor.current.x = (event.clientX / window.innerWidth) * 2 - 1
      cursor.current.y = -(event.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('pointermove', trackPointer, { passive: true })
    return () => window.removeEventListener('pointermove', trackPointer)
  }, [])

  useFrame((state, delta) => {
    if (!rig.current || !body.current) return
    const ease = Math.min(delta * 3.2, 1)
    rig.current.rotation.x += (cursor.current.y * 0.13 - rig.current.rotation.x) * ease
    rig.current.rotation.y += (cursor.current.x * 0.34 - rig.current.rotation.y) * ease
    rig.current.position.x += (cursor.current.x * 0.28 - rig.current.position.x) * ease
    rig.current.position.y += (cursor.current.y * 0.2 - rig.current.position.y) * ease
    body.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.72) * 0.035
    body.current.position.y = Math.sin(state.clock.elapsedTime * 0.9) * 0.045
  })

  return (
    <group ref={rig} rotation={[-0.04, -0.16, -0.08]} scale={0.94}>
      <group ref={body}>
        {spine.slice(0, -1).map((point, index) => (
          <Bone key={`spine-${index}`} start={point} end={spine[index + 1]} radius={0.055 - index * 0.0015} material={boneMaterial} />
        ))}
        {spine.map((point, index) => (
          <mesh key={`vertebra-${index}`} position={point} scale={[0.09, 0.075, 0.09]} material={boneMaterial}>
            <octahedronGeometry args={[1, 0]} />
          </mesh>
        ))}
        {spine.slice(3, 9).map((point, index) => {
          const spread = 0.42 - Math.abs(index - 2.5) * 0.035
          const lowerY = point[1] - 0.48
          const left: Point = [point[0] - 0.05, point[1] - 0.16, spread]
          const leftTip: Point = [point[0] + 0.04, lowerY, spread * 0.38]
          const right: Point = [point[0] - 0.05, point[1] - 0.16, -spread]
          const rightTip: Point = [point[0] + 0.04, lowerY, -spread * 0.38]
          return (
            <group key={`rib-${index}`}>
              <Bone start={point} end={left} radius={0.026} material={darkBoneMaterial} />
              <Bone start={left} end={leftTip} radius={0.021} material={darkBoneMaterial} />
              <Bone start={point} end={right} radius={0.026} material={darkBoneMaterial} />
              <Bone start={right} end={rightTip} radius={0.021} material={darkBoneMaterial} />
            </group>
          )
        })}
        {wingBones.map(([start, end], index) => (
          <Bone key={`wing-${index}`} start={start} end={end} radius={index % 4 === 0 ? 0.045 : 0.027} material={darkBoneMaterial} />
        ))}
        <group position={[1.55, 0.55, 0]} rotation={[0, -0.05, -0.08]}>
          <mesh scale={[0.34, 0.25, 0.24]} material={boneMaterial}><dodecahedronGeometry args={[1, 0]} /></mesh>
          <mesh position={[0.3, -0.055, 0]} scale={[0.36, 0.12, 0.19]} material={boneMaterial}><boxGeometry args={[1, 1, 1]} /></mesh>
          <Bone start={[-0.08, 0.13, 0.11]} end={[-0.42, 0.55, 0.22]} radius={0.035} material={darkBoneMaterial} />
          <Bone start={[-0.08, 0.13, -0.11]} end={[-0.42, 0.55, -0.22]} radius={0.035} material={darkBoneMaterial} />
          <mesh position={[0.18, 0.04, 0.2]}><sphereGeometry args={[0.035, 12, 12]} /><meshBasicMaterial color="#d9c08c" /></mesh>
          <mesh position={[0.18, 0.04, -0.2]}><sphereGeometry args={[0.035, 12, 12]} /><meshBasicMaterial color="#d9c08c" /></mesh>
          {[-0.2, -0.05, 0.1, 0.25, 0.4].map((x) => (
            <mesh key={x} position={[x, -0.19, 0]} rotation={[0, 0, Math.PI]} material={boneMaterial}>
              <coneGeometry args={[0.026, 0.12, 5]} />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  )
}

export default function HeroScene() {
  const reducedMotion = useSyncExternalStore(subscribeToReducedMotion, getReducedMotion, () => true)

  if (reducedMotion) return <HeroFallback />

  return (
    <div className="hero-scene">
      <Canvas
        dpr={[1, 1.4]}
        camera={{ position: [0, 0, 5.4], fov: 43 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        fallback={<HeroFallback />}
      >
        <ambientLight intensity={1.15} />
        <directionalLight position={[2.5, 4, 5]} intensity={3.8} color="#fff8e8" />
        <pointLight position={[-3, -2, 3]} intensity={10} color="#75644b" />
        <DragonSkeleton />
        <Sparkles count={24} scale={[5.2, 3.1, 1.5]} size={1.25} speed={0.16} color="#e9dfc7" opacity={0.38} />
      </Canvas>
    </div>
  )
}
