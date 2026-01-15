'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Environment } from '@react-three/drei'
import * as THREE from 'three'

interface OrbProps {
  color: string
  position?: [number, number, number]
  scale?: number
  speed?: number
}

function Orb({ color, position = [0, 0, 0], scale = 1, speed = 1 }: OrbProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2 * speed
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3 * speed
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial
          color={color}
          envMapIntensity={0.5}
          clearcoat={1}
          clearcoatRoughness={0}
          metalness={0.1}
          roughness={0.3}
          distort={0.4}
          speed={2}
        />
      </mesh>
    </Float>
  )
}

interface ProjectOrbProps {
  activeProjects: number
  totalProjects: number
  className?: string
}

export function ProjectOrb({ activeProjects, totalProjects, className = '' }: ProjectOrbProps) {
  const progress = totalProjects > 0 ? activeProjects / totalProjects : 0

  // Color transitions from violet to coral based on activity
  const orbColor = useMemo(() => {
    const violet = new THREE.Color('#8b6ec9')
    const coral = new THREE.Color('#e07860')
    return violet.lerp(coral, progress).getHexString()
  }, [progress])

  return (
    <div className={`relative ${className}`}>
      <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b6ec9" />
        <Orb color={`#${orbColor}`} scale={1.5} />
        <Environment preset="city" />
      </Canvas>
      
      {/* Overlay stats */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <p className="text-5xl font-display font-bold text-white drop-shadow-lg">
            {activeProjects}
          </p>
          <p className="text-sm text-white/70">Active</p>
        </div>
      </div>
    </div>
  )
}
