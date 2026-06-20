import React, { useMemo } from 'react'

// Two images per hovered project. They FADE in (no sliding) at randomized
// positions. The range now reaches far enough left that an image can land over
// the project list, but the two are kept a minimum distance apart so they're
// never too overlapping with each other.
// `images` is an array of (2) URLs that changes each time a new project is hovered.

const LEFT_MIN = 24    // vw — far enough left to overlap the project list
const LEFT_MAX = 64   // vw — rightmost left-edge (keeps the image on screen)
const TOP_MIN = 8     // %
const TOP_MAX = 55    // %
const MIN_GAP = 26    // vw — minimum horizontal gap between the two images

const rand = (min, max) => min + Math.random() * (max - min)

function rollPositions() {
  const a = { left: rand(LEFT_MIN, LEFT_MAX), top: rand(TOP_MIN, TOP_MAX) }

  // roll B until it's far enough from A horizontally (a few tries, then accept)
  let b = { left: rand(LEFT_MIN, LEFT_MAX), top: rand(TOP_MIN, TOP_MAX) }
  for (let i = 0; i < 12 && Math.abs(b.left - a.left) < MIN_GAP; i++) {
    b = { left: rand(LEFT_MIN, LEFT_MAX), top: rand(TOP_MIN, TOP_MAX) }
  }

  return [a, b].map((p) => ({ left: `${p.left}vw`, top: `${p.top}%` }))
}

export default function Sliders({ images = [] }) {
  // roll fresh positions whenever the image set changes (new project hovered),
  // and keep them stable while the same pair is shown.
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
