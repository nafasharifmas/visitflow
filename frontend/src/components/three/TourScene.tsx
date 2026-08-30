import { Canvas } from '@react-three/fiber'
import { Float, OrbitControls } from '@react-three/drei'

function Island() {
  return <><mesh rotation={[-0.45, 0.2, 0]}><dodecahedronGeometry args={[1.35, 1]} /><meshStandardMaterial color="#217a64" flatShading /></mesh><Float speed={1.2} floatIntensity={0.35}><mesh position={[0.2, 1.25, 0]}><coneGeometry args={[0.11, 0.32, 16]} /><meshStandardMaterial color="#f7c75c" /></mesh></Float></>
}

export default function TourScene() {
  return <Canvas camera={{ position: [0, 0.1, 4], fov: 46 }} aria-label="Decorative low-poly island scene"><ambientLight intensity={1.2} /><directionalLight position={[3, 4, 4]} intensity={2} /><Island /><OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.55} /></Canvas>
}

