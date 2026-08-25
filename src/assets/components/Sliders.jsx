import { useMemo } from 'react'


const LEFT_MIN = 24
const LEFT_MAX = 64
const TOP_MIN = 8
const TOP_MAX = 55
const MIN_GAP = 26

const rand = (min, max) => min + Math.random() * (max - min)

function rollPositions() {
  const a = { left: rand(LEFT_MIN, LEFT_MAX), top: rand(TOP_MIN, TOP_MAX) }

  let b = { left: rand(LEFT_MIN, LEFT_MAX), top: rand(TOP_MIN, TOP_MAX) }
  for (let i = 0; i < 12 && Math.abs(b.left - a.left) < MIN_GAP; i++) {
    b = { left: rand(LEFT_MIN, LEFT_MAX), top: rand(TOP_MIN, TOP_MAX) }
  }

  return [a, b].map((p) => ({ left: `${p.left}vw`, top: `${p.top}%` }))
}

export default function Sliders({ images = [] }) {
  const positions = useMemo(() => rollPositions(), [images])

  if (!images.length) return null

  return (
    <div className="sliders">
      {images.slice(0, 2).map((src, idx) => (
        <img
          key={src}
          src={src}
          alt=""
          className="slide"
          style={positions[idx]}
        />
      ))}
    </div>
  )
}
