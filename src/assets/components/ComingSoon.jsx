import React from 'react'
import '../../styling/ComingSoon.css'

// full-screen placeholder "page" — same background as the site. tap Back (or
// anywhere outside the text) to return. swap this for a real route later.
function ComingSoon({ onBack }) {
  return (
    <div className='comingSoon' onClick={onBack}>
      <button
        className='comingSoonBack'
        onClick={(e) => { e.stopPropagation(); onBack() }}
      >
        ← back
      </button>
      <h1>coming soon</h1>
    </div>
  )
}

export default ComingSoon
