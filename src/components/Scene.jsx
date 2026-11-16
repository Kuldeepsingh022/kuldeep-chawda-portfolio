import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Sparkles, Stars } from '@react-three/drei'
import * as THREE from 'three'

// Shared, mutable input state (read inside the render loop, no React re-renders)
const input = { mx: 0, my: 0, scroll: 0 }

function useInputTracking() {
  useEffect(() => {
    const onMove = (e) => {
      input.mx = (e.clientX / window.innerWidth) * 2 - 1
      input.my = -(e.clientY / window.innerHeight) * 2 + 1
    }
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      input.scroll = max > 0 ? window.scrollY / max : 0
    }
    onScroll()
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])
}

/** The glowing core in the hero: distorted sphere + wireframe shell + rings + orbiting moons */
function Core({ isMobile }) {
  const group = useRef()
  const shell = useRef()
  const ringA = useRef()
  const ringB = useRef()
  const moons = useRef()

  useFrame((state, delta) => {
    const s = input.scroll
    const g = group.current
    // Glide the core from side to side as the user scrolls through sections
    const targetX = isMobile ? 0 : 2.3 * Math.cos(s * Math.PI * 3)
    const targetY = isMobile ? 1.5 - s * 1.2 : Math.sin(s * Math.PI * 2) * 0.4
    const targetScale = isMobile ? 0.55 : 1 - Math.min(s * 4, 1) * 0.25
    g.position.x = THREE.MathUtils.damp(g.position.x, targetX, 3, delta)
    g.position.y = THREE.MathUtils.damp(g.position.y, targetY, 3, delta)
    const sc = THREE.MathUtils.damp(g.scale.x, targetScale, 3, delta)
    g.scale.setScalar(sc)
    g.rotation.y += delta * 0.2
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, input.my * 0.4 + s * 2, 2, delta)

    shell.current.rotation.x -= delta * 0.15
    shell.current.rotation.z += delta * 0.1
    ringA.current.rotation.z += delta * 0.4
    ringB.current.rotation.z -= delta * 0.3
    moons.current.rotation.y += delta * 0.8
  })

  return (
    <group ref={group} position={[isMobile ? 0 : 2.3, isMobile ? 1.5 : 0, 0]}>
      <Float speed={2} rotationIntensity={0.6} floatIntensity={1.2}>
        <mesh>
          <icosahedronGeometry args={[1.15, isMobile ? 24 : 48]} />
          <MeshDistortMaterial
            color="#6d28d9"
            emissive="#3b0764"
            emissiveIntensity={0.6}
            roughness={0.15}
            metalness={0.85}
            distort={0.42}
            speed={2.2}
          />
        </mesh>
        <mesh ref={shell}>
          <icosahedronGeometry args={[1.75, 1]} />
          <meshBasicMaterial color="#22d3ee" wireframe transparent opacity={0.35} />
        </mesh>
        <mesh ref={ringA} rotation={[Math.PI / 2.4, 0, 0]}>
          <torusGeometry args={[2.3, 0.025, 16, 160]} />
          <meshBasicMaterial color="#22d3ee" toneMapped={false} />
        </mesh>
        <mesh ref={ringB} rotation={[Math.PI / 1.7, 0.6, 0]}>
          <torusGeometry args={[2.6, 0.015, 16, 160]} />
          <meshBasicMaterial color="#ec4899" toneMapped={false} />
        </mesh>
        <group ref={moons}>
          {[0, 1, 2].map((i) => {
            const a = (i / 3) * Math.PI * 2
            return (
              <mesh key={i} position={[Math.cos(a) * 2.3, Math.sin(a) * 0.6, Math.sin(a) * 2.3]}>
                <sphereGeometry args={[0.09, 24, 24]} />
                <meshBasicMaterial color={['#22d3ee', '#f472b6', '#a78bfa'][i]} toneMapped={false} />
              </mesh>
            )
          })}
        </group>
      </Float>
    </group>
  )
}

// Deterministic pseudo-random (pure, stable across renders)
const rnd = (i, k) => {
  const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453
  return x - Math.floor(x)
}

/** Floating geometric shapes scattered through the depth of the page */
function Shards({ count }) {
  const items = useMemo(() => {
    const geos = ['box', 'octa', 'tetra', 'torus']
    const colors = ['#22d3ee', '#8b5cf6', '#ec4899', '#38bdf8', '#a78bfa']
    return Array.from({ length: count }, (_, i) => ({
      geo: geos[i % geos.length],
      color: colors[i % colors.length],
      pos: [(rnd(i, 1) - 0.5) * 14, -rnd(i, 2) * 30 + 4, -rnd(i, 3) * 6 - 2],
      rot: [rnd(i, 4) * Math.PI, rnd(i, 5) * Math.PI, 0],
      scale: 0.15 + rnd(i, 6) * 0.35,
      speed: 0.5 + rnd(i, 7),
    }))
  }, [count])

  const group = useRef()
  useFrame((_, delta) => {
    // Shapes travel upward as you scroll, giving depth/parallax
    const targetY = input.scroll * 26
    group.current.position.y = THREE.MathUtils.damp(group.current.position.y, targetY, 2.5, delta)
  })

  return (
    <group ref={group}>
      {items.map((it, i) => (
        <Float key={i} speed={it.speed} rotationIntensity={2} floatIntensity={1.5}>
          <mesh position={it.pos} rotation={it.rot} scale={it.scale}>
            {it.geo === 'box' && <boxGeometry args={[1, 1, 1]} />}
            {it.geo === 'octa' && <octahedronGeometry args={[1, 0]} />}
            {it.geo === 'tetra' && <tetrahedronGeometry args={[1, 0]} />}
            {it.geo === 'torus' && <torusGeometry args={[0.7, 0.25, 12, 32]} />}
            <meshStandardMaterial
              color={it.color}
              emissive={it.color}
              emissiveIntensity={0.25}
              metalness={0.6}
              roughness={0.3}
              wireframe={i % 3 === 0}
            />
          </mesh>
        </Float>
      ))}
    </group>
  )
}

/** Camera gently follows the pointer and dollies with scroll */
function CameraRig() {
  useFrame((state, delta) => {
    const cam = state.camera
    cam.position.x = THREE.MathUtils.damp(cam.position.x, input.mx * 0.6, 2, delta)
    cam.position.y = THREE.MathUtils.damp(cam.position.y, input.my * 0.4, 2, delta)
    cam.position.z = THREE.MathUtils.damp(cam.position.z, 7 - Math.sin(input.scroll * Math.PI) * 1.2, 2, delta)
    cam.lookAt(0, 0, 0)
  })
  return null
}

function StarField() {
  const ref = useRef()
  useFrame((_, delta) => {
    ref.current.rotation.y += delta * 0.01
    ref.current.rotation.x = input.scroll * 0.6
  })
  return (
    <group ref={ref}>
      <Stars radius={80} depth={60} count={4000} factor={4} saturation={0} fade speed={1} />
    </group>
  )
}

export default function Scene({ isMobile, reducedMotion }) {
  useInputTracking()
  return (
    <div className="scene" aria-hidden="true">
      <Canvas
        dpr={[1, isMobile ? 1.5 : 2]}
        camera={{ position: [0, 0, 7], fov: 50 }}
        gl={{ antialias: !isMobile, powerPreference: 'high-performance', alpha: true }}
        frameloop={reducedMotion ? 'demand' : 'always'}
      >
        <fog attach="fog" args={['#05060f', 8, 22]} />
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={60} color="#22d3ee" />
        <pointLight position={[-5, -3, 3]} intensity={50} color="#ec4899" />
        <directionalLight position={[0, 4, 6]} intensity={1.2} />
        <StarField />
        <Sparkles count={isMobile ? 40 : 90} scale={[12, 8, 6]} size={2.5} speed={0.4} color="#a5f3fc" />
        <Core isMobile={isMobile} />
        <Shards count={isMobile ? 10 : 22} />
        <CameraRig />
      </Canvas>
    </div>
  )
}
