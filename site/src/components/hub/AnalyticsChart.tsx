'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Text } from '@react-three/drei'
import * as THREE from 'three'

interface BarProps {
  height: number
  position: [number, number, number]
  color: string
  label: string
}

function Bar({ height, position, color, label }: BarProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const targetHeight = useRef(0)
  
  useMemo(() => {
    targetHeight.current = height
  }, [height])

  useFrame(() => {
    if (meshRef.current) {
      const currentScale = meshRef.current.scale.y
      const diff = targetHeight.current - currentScale
      meshRef.current.scale.y += diff * 0.05
      meshRef.current.position.y = meshRef.current.scale.y / 2
    }
  })

  return (
    <group position={position}>
      <mesh ref={meshRef} position={[0, height / 2, 0]}>
        <boxGeometry args={[0.6, 1, 0.6]} />
        <meshStandardMaterial 
          color={color} 
          metalness={0.3} 
          roughness={0.4}
          emissive={color}
          emissiveIntensity={0.1}
        />
      </mesh>
    </group>
  )
}

interface AnalyticsChartProps {
  data: { label: string; value: number; color: string }[]
  className?: string
}

export function AnalyticsChart({ data, className = '' }: AnalyticsChartProps) {
  const maxValue = Math.max(...data.map(d => d.value), 1)
  const spacing = 1.2

  return (
    <div className={`relative ${className}`}>
      <Canvas camera={{ position: [0, 2, 6], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-5, 5, -5]} intensity={0.5} color="#8b6ec9" />
        
        {/* Grid floor */}
        <gridHelper args={[10, 10, '#333', '#222']} position={[0, 0, 0]} />
        
        {/* Bars */}
        {data.map((item, index) => (
          <Float key={item.label} speed={1} floatIntensity={0.1}>
            <Bar
              height={(item.value / maxValue) * 3 + 0.1}
              position={[(index - (data.length - 1) / 2) * spacing, 0, 0]}
              color={item.color}
              label={item.label}
            />
          </Float>
        ))}
      </Canvas>
      
      {/* Labels */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-6">
        {data.map((item) => (
          <div key={item.label} className="text-center">
            <div 
              className="w-3 h-3 rounded-full mx-auto mb-1"
              style={{ backgroundColor: item.color }}
            />
            <p className="text-xs text-ns-gray-400">{item.label}</p>
            <p className="text-sm font-semibold text-white">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
