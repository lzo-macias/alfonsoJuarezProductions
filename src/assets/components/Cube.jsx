import React, { useMemo, useRef, Suspense } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'

// --- cube layout ----------------------------------------------------------
const S = 1.6        // cube side length (world units) — lower = smaller cube
const N = 3          // tiles per row/col on each face  -> N*N per face, 6 faces
const GAP = 0.7      // 1 = no gap, smaller = bigger gaps (you see through to the back)
const t = S / N      // size of one tile cell

const FACES = [
  { pos: [0, 0, S / 2], rot: [0, 0, 0] },            // front  +Z
  { pos: [0, 0, -S / 2], rot: [0, Math.PI, 0] },     // back   -Z
  { pos: [S / 2, 0, 0], rot: [0, Math.PI / 2, 0] },  // right  +X
  { pos: [-S / 2, 0, 0], rot: [0, -Math.PI / 2, 0] },// left   -X
  { pos: [0, S / 2, 0], rot: [-Math.PI / 2, 0, 0] }, // top    +Y
  { pos: [0, -S / 2, 0], rot: [Math.PI / 2, 0, 0] }, // bottom -Y
]

// deterministic pseudo-random so per-tile values are stable across renders
const seeded = (i) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}
const clamp01 = (x) => Math.max(0, Math.min(1, x))

// For a given project index, pick exactly 9 panels, max 3 per face, randomized
// but stable. tile.key = faceIndex*9 + cell, so floor(key/9) recovers the face.
function buildSelection(p) {
  const counts = [0, 0, 0, 0, 0, 0]
  let placed = 0, step = 0
  while (placed < 9 && step < 300) {
    const f = Math.floor(seeded(p * 131 + step * 7 + 3) * 6) % 6
    step++
    if (counts[f] < 3) { counts[f]++; placed++ }
  }
  const set = new Set()
  for (let f = 0; f < 6; f++) {
    const chosen = new Set()
    let s = 0
    while (chosen.size < counts[f] && s < 100) {
      chosen.add(Math.floor(seeded(p * 977 + f * 37 + s * 5 + 1) * 9) % 9)
      s++
    }
    chosen.forEach((cell) => set.add(f * 9 + cell))
  }
  return set
}

const _v = new THREE.Vector3()

// Per-frame look of a tile. Two modes:
//  - IDLE (nothing hovered): depth drives opacity/brightness — front panels bold,
//    interior shadowed & translucent.
//  - SELECTING (a project hovered): the project's 9 panels go bold & opaque;
//    every other panel fades to near-invisible.
function useTileLook(mesh, mat, phase, scroll, selected, active) {
  useFrame((state) => {
    if (!mesh.current || !mat.current) return
    const time = state.clock.elapsedTime

    // depth: k = 1 facing the viewer, 0 deep in the cube
    mesh.current.getWorldPosition(_v)
    const d = state.camera.position.distanceTo(_v)
    const k = clamp01((state.camera.position.z + S / 2 - d) / S)
    const facing = Math.pow(k, 1.5)

    // gentle pulse, amplified by scroll velocity
    const vel = scroll?.current?.velocity ?? 0
    const activity = Math.min(vel * 0.05, 1)
    const pulse = Math.sin(time * 1.3 + phase * 6.2831) * 0.5 + 0.5
    const focus = pulse * (0.25 + activity * 0.75)

    let targetScale, targetOpacity, targetBright
    if (active) {
      if (selected) {
        targetScale = 1.16 + focus * 0.16
        targetOpacity = 1.0
        targetBright = 1.3                 // bold, slightly over-bright
      } else {
        targetScale = 0.92
        targetOpacity = 0.04               // almost gone
        targetBright = 0.22
      }
    } else {
      targetScale = 1 + focus * 0.3 + facing * 0.12
      targetOpacity = 0.1 + k * 0.9
      targetBright = 0.1 + facing * 1.35
    }

    // ease everything so hover transitions are smooth
    const s = mesh.current.scale.x + (targetScale - mesh.current.scale.x) * 0.12
    mesh.current.scale.setScalar(s)
    mat.current.opacity += (targetOpacity - mat.current.opacity) * 0.15
    const b = mat.current.color.r + (targetBright - mat.current.color.r) * 0.15
    mat.current.color.setScalar(b)
  })
}

// --- tiles ----------------------------------------------------------------
function ImageTile({ url, size, phase, scroll, selected, active, ...props }) {
  const mesh = useRef()
  const mat = useRef()
  const tex = useTexture(url)
  useTileLook(mesh, mat, phase, scroll, selected, active)
  return (
    <mesh ref={mesh} {...props}>
      <planeGeometry args={[size, size]} />
      <meshBasicMaterial ref={mat} map={tex} transparent side={THREE.DoubleSide} toneMapped={false} />
    </mesh>
  )
}

function BlankTile({ size, phase, scroll, selected, active, ...props }) {
  const mesh = useRef()
  const mat = useRef()
  useTileLook(mesh, mat, phase, scroll, selected, active)
  return (
    <mesh ref={mesh} {...props}>
      <planeGeometry args={[size, size]} />
      <meshBasicMaterial ref={mat} color="#3a3a3a" transparent side={THREE.DoubleSide} toneMapped={false} />
    </mesh>
  )
}

// --- the cube -------------------------------------------------------------
function CubeGroup({ images, scroll, hovered }) {
  const group = useRef()
  const active = hovered >= 0
  // the 9 panel keys lit up by the hovered project (recomputed only on hover change)
  const selectedSet = useMemo(() => (active ? buildSelection(hovered) : null), [hovered, active])

  const tiles = useMemo(() => {
    const out = []
    let n = 0
    FACES.forEach((face) => {
      for (let r = 0; r < N; r++) {
        for (let c = 0; c < N; c++) {
          const u = (c - (N - 1) / 2) * t
          const v = (r - (N - 1) / 2) * t
          const depth = seeded(n) * 0.12
          const url = images.length ? images[n % images.length] : null
          out.push({ key: n, face, u, v, depth, url, size: t * GAP, phase: seeded(n + 7) })
          n++
        }
      }
    })
    return out
  }, [images])

  useFrame((state, dt) => {
    if (!group.current) return
    if (scroll?.current) scroll.current.velocity *= 0.92
    // multi-axis wandering tumble
    const ts = state.clock.elapsedTime
    group.current.rotation.y += dt * (0.26 + 0.10 * Math.sin(ts * 0.13))
    group.current.rotation.x += dt * (0.17 + 0.08 * Math.sin(ts * 0.09))
    group.current.rotation.z += dt * (0.06 + 0.04 * Math.sin(ts * 0.07))
    // grow the whole cube while a project is hovered
    const target = active ? 1.35 : 1.0
    const gs = group.current.scale.x + (target - group.current.scale.x) * 0.08
    group.current.scale.setScalar(gs)
  })

  return (
    <group ref={group} position={[0.25, 0.2, 0]}>
      {FACES.map((face, fi) => (
        <group key={fi} position={face.pos} rotation={face.rot}>
          {tiles
            .filter((tile) => tile.face === face)
            .map((tile) => {
              const common = {
                size: tile.size,
                phase: tile.phase,
                scroll,
                active,
                selected: selectedSet ? selectedSet.has(tile.key) : false,
                position: [tile.u, tile.v, tile.depth],
              }
              return tile.url ? (
                <Suspense key={tile.key} fallback={<BlankTile {...common} />}>
                  <ImageTile url={tile.url} {...common} />
                </Suspense>
              ) : (
                <BlankTile key={tile.key} {...common} />
              )
            })}
        </group>
      ))}
    </group>
  )
}

export default function Cube({ images = [], scroll, hovered = -1 }) {
  // wrapper div carries the positioning/sizing CSS; the Canvas fills it 100%.
  // (react-three-fiber puts inline width/height/position on the Canvas container,
  // which would otherwise override our class.) pointerEvents:none so the canvas
  // never blocks hovering the project list beneath it.
  return (
    <div className="cube-canvas">
      <Canvas
        style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
        camera={{ position: [0, 0, 6], fov: 35 }}
      >
        <CubeGroup images={images} scroll={scroll} hovered={hovered} />
      </Canvas>
    </div>
  )
}
