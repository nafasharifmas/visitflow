import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, OrbitControls, Sparkles } from '@react-three/drei'
import type { Group } from 'three'

function Clouds() {
  return (
    <Float speed={1.1} floatIntensity={0.5} rotationIntensity={0.2}>
      <group position={[-1.6, 1.7, -1.2]} scale={0.55}>
        <mesh><sphereGeometry args={[0.42, 12, 12]} /><meshStandardMaterial color="#ffffff" flatShading /></mesh>
        <mesh position={[0.45, 0.08, 0]}><sphereGeometry args={[0.3, 12, 12]} /><meshStandardMaterial color="#ffffff" flatShading /></mesh>
      </group>
      <group position={[1.7, 1.9, -1.4]} scale={0.45}>
        <mesh><sphereGeometry args={[0.4, 12, 12]} /><meshStandardMaterial color="#ffffff" flatShading /></mesh>
        <mesh position={[-0.4, 0.06, 0]}><sphereGeometry args={[0.28, 12, 12]} /><meshStandardMaterial color="#ffffff" flatShading /></mesh>
      </group>
    </Float>
  )
}

function Palms() {
  return (
    <>
      <group position={[0.55, 0.62, 0.2]} rotation={[0, -0.4, 0.08]} scale={0.85}>
        <mesh position={[0, 0.32, 0]}><cylinderGeometry args={[0.07, 0.11, 0.9, 8]} /><meshStandardMaterial color="#8a5a33" flatShading /></mesh>
        <Float speed={1.7} floatIntensity={0.45} rotationIntensity={0.5}>
          <group position={[0, 0.78, 0]}>
            {[0, 1, 2, 3, 4].map((index) => (
              <mesh key={index} position={[0, 0.12, 0]} rotation={[0, (index / 5) * Math.PI * 2, 0.55]}>
                <coneGeometry args={[0.22, 1.05, 5]} />
                <meshStandardMaterial color={index % 2 ? '#3f9b4f' : '#2f8f46'} flatShading />
              </mesh>
            ))}
          </group>
        </Float>
      </group>
      <group position={[-0.75, 0.5, -0.15]} rotation={[0, 0.6, -0.06]} scale={0.7}>
        <mesh position={[0, 0.26, 0]}><cylinderGeometry args={[0.06, 0.09, 0.75, 8]} /><meshStandardMaterial color="#9a6a3d" flatShading /></mesh>
        <Float speed={1.9} floatIntensity={0.5} rotationIntensity={0.5}>
          <group position={[0, 0.66, 0]}>
            {[0, 1, 2, 3, 4].map((index) => (
              <mesh key={index} position={[0, 0.1, 0]} rotation={[0, (index / 5) * Math.PI * 2, 0.55]}>
                <coneGeometry args={[0.19, 0.9, 5]} />
                <meshStandardMaterial color={index % 2 ? '#4aa85a' : '#369347'} flatShading />
              </mesh>
            ))}
          </group>
        </Float>
      </group>
    </>
  )
}

function Island() {
  return (
    <group>
      <mesh rotation={[-0.35, 0.2, 0]} castShadow>
        <icosahedronGeometry args={[1.5, 1]} />
        <meshStandardMaterial color="#7db55a" flatShading />
      </mesh>
      <Palms />
      <Float speed={1.2} floatIntensity={0.4}>
        <mesh position={[0.1, 1.35, 0]} rotation={[-0.1, 0, 0]}>
          <coneGeometry args={[0.28, 0.5, 6]} />
          <meshStandardMaterial color="#f0a94f" flatShading />
        </mesh>
      </Float>
    </group>
  )
}

function Boat() {
  return (
    <Float speed={1.4} floatIntensity={0.7} rotationIntensity={0.25}>
      <group position={[1.35, 0.25, 0.7]} rotation={[0, -0.5, 0]} scale={0.6}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.7, 0.18, 0.28]} />
          <meshStandardMaterial color="#e07a45" flatShading />
        </mesh>
        <mesh position={[0, 0.28, 0]} rotation={[0, 0, 0.08]}>
          <coneGeometry args={[0.09, 0.55, 3]} />
          <meshStandardMaterial color="#f7e7c8" flatShading />
        </mesh>
      </group>
    </Float>
  )
}

function Ocean() {
  const waves = useRef<Group>(null)
  useFrame(({ clock }) => {
    if (waves.current) {
      waves.current.position.y = Math.sin(clock.getElapsedTime() * 1.2) * 0.05
    }
  })
  return (
    <group ref={waves}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[18, 18, 24, 24]} />
        <meshStandardMaterial color="#38bdf8" wireframe transparent opacity={0.22} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.08, 0]}>
        <planeGeometry args={[18, 18]} />
        <meshStandardMaterial color="#0ea5e9" transparent opacity={0.35} />
      </mesh>
    </group>
  )
}

export default function TouristScene({ interactive = true }: { interactive?: boolean }) {
  return (
    <Canvas camera={{ position: [0, 0.2, 4.6], fov: 46 }} aria-label="Decorative low-poly tropical island scene" className="scene">
      <ambientLight intensity={1.15} />
      <directionalLight position={[3, 4, 4]} intensity={1.9} />
      <Ocean />
      <Island />
      <Boat />
      <Clouds />
      <Sparkles count={28} scale={6} size={2.2} speed={0.4} color="#fef3c7" />
      {interactive ? <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.55} /> : null}
    </Canvas>
  )
}