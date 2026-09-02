"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"

function GarmentTagMesh() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.getElapsedTime()
    // Gentle floating: sine-wave y offset + slow rotation
    groupRef.current.position.y = Math.sin(t * 0.7) * 0.08
    groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.12 + 0.2
    groupRef.current.rotation.x = Math.sin(t * 0.2) * 0.04
  })

  return (
    <group ref={groupRef}>
      {/* Tag body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.6, 2.2, 0.08]} />
        <meshStandardMaterial color="#A8FF3E" roughness={0.4} metalness={0.1} />
      </mesh>

      {/* Top hole — dark circle */}
      <mesh position={[0, 0.8, 0.045]}>
        <ringGeometry args={[0.12, 0.18, 24]} />
        <meshStandardMaterial color="#1A1A1A" />
      </mesh>

      {/* Brand label strip */}
      <mesh position={[0, 0.3, 0.046]}>
        <boxGeometry args={[0.9, 0.18, 0.005]} />
        <meshStandardMaterial color="#1A1A1A" />
      </mesh>

      {/* Care info lines */}
      <mesh position={[0, -0.05, 0.046]}>
        <boxGeometry args={[0.8, 0.06, 0.005]} />
        <meshStandardMaterial color="#1A1A1A" opacity={0.5} transparent />
      </mesh>
      <mesh position={[0, -0.18, 0.046]}>
        <boxGeometry args={[0.6, 0.06, 0.005]} />
        <meshStandardMaterial color="#1A1A1A" opacity={0.35} transparent />
      </mesh>
      <mesh position={[0, -0.31, 0.046]}>
        <boxGeometry args={[0.7, 0.06, 0.005]} />
        <meshStandardMaterial color="#1A1A1A" opacity={0.25} transparent />
      </mesh>

      {/* Care wash label */}
      <mesh position={[0, -0.55, 0.046]}>
        <boxGeometry args={[0.75, 0.4, 0.005]} />
        <meshStandardMaterial color="#FFF8F0" />
      </mesh>
      {/* Wash lines */}
      <mesh position={[0, -0.5, 0.048]}>
        <boxGeometry args={[0.55, 0.025, 0.002]} />
        <meshStandardMaterial color="#1A1A1A" opacity={0.4} transparent />
      </mesh>
      <mesh position={[0, -0.57, 0.048]}>
        <boxGeometry args={[0.4, 0.025, 0.002]} />
        <meshStandardMaterial color="#1A1A1A" opacity={0.3} transparent />
      </mesh>
    </group>
  )
}

interface GarmentTag3DProps {
  className?: string
}

export function GarmentTag3D({ className }: GarmentTag3DProps) {
  return (
    <div className={className} style={{ width: "100%", height: "100%" }}>
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 40 }}
        shadows
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 5, 3]} intensity={1.2} castShadow />
        <directionalLight position={[-2, 3, -2]} intensity={0.4} />
        <GarmentTagMesh />
      </Canvas>
    </div>
  )
}
