import '../../styling/ComingSoon.css'

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
