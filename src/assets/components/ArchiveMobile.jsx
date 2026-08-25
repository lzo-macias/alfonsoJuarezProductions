import { useState } from 'react'
import '../../styling/ArchiveMobile.css'

const FILTERS = [1, 2, 3, 4, 5, 6, 7]

const projects = [
  'Basketcase x New Balance Pelle Cass',
  'Basketcase x New Balance World Cup Campaign',
  'Mangox Eckhaus Latta Collaboration',
  'Eckhaus Latta Seen Campaign',
  'Eckhaus Latta SS26',
  'Eckhaus Latta AW26 Bag Campaign',
  'Basketcase Gallery Season 6 Paris',
  'Basketcase Gallery x New Balance 204L',
  'Basketcase Gallery x New Balance Japan',
  'Eckhaus Latta Akira Campaign',
  'MSCHF GSCT Racquet Mag',
  'Alexander Wang The Wangover S25',
  'Basketcase Gallery ComplexCon HongKong',
  'Eckhaus Latta AW25',
  'Alexander Wang The Wangover PF25',
  'Grace Ling SS26 Runway',
  'Vogue Trending Now',
  'Vogue Just Browsing',
  'Minecraft x Adidas Collaboration',
  '†',
  'Teva Camino de Santiago',
    'Basketcase x New Balance Pelle Cass',
  'Basketcase x New Balance World Cup Campaign',
  'Mangox Eckhaus Latta Collaboration',
  'Eckhaus Latta Seen Campaign',
  'Eckhaus Latta SS26',
  'Eckhaus Latta AW26 Bag Campaign',
  'Basketcase Gallery Season 6 Paris',
  'Basketcase Gallery x New Balance 204L',
  'Basketcase Gallery x New Balance Japan',
  'Eckhaus Latta Akira Campaign',
  'MSCHF GSCT Racquet Mag',
  'Alexander Wang The Wangover S25',
  'Basketcase Gallery ComplexCon HongKong',
  'Eckhaus Latta AW25',
  'Alexander Wang The Wangover PF25',
  'Grace Ling SS26 Runway',
  'Vogue Trending Now',
  'Vogue Just Browsing',
  'Minecraft x Adidas Collaboration',
  '†',
  'Teva Camino de Santiago',
    'Basketcase x New Balance Pelle Cass',
  'Basketcase x New Balance World Cup Campaign',
  'Mangox Eckhaus Latta Collaboration',
  'Eckhaus Latta Seen Campaign',
  'Eckhaus Latta SS26',
  'Eckhaus Latta AW26 Bag Campaign',
  'Basketcase Gallery Season 6 Paris',
  'Basketcase Gallery x New Balance 204L',
  'Basketcase Gallery x New Balance Japan',
  'Eckhaus Latta Akira Campaign',
  'MSCHF GSCT Racquet Mag',
  'Alexander Wang The Wangover S25',
  'Basketcase Gallery ComplexCon HongKong',
  'Eckhaus Latta AW25',
  'Alexander Wang The Wangover PF25',
  'Grace Ling SS26 Runway',
  'Vogue Trending Now',
  'Vogue Just Browsing',
  'Minecraft x Adidas Collaboration',
  '†',
  'Teva Camino de Santiago',
]

function ArchiveMobile() {
  const [filterOpen, setFilterOpen] = useState(false)
  const [selected, setSelected] = useState([])

  const toggleFilter = (n) =>
    setSelected((prev) => (prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n]))

  return (
    <div className='archiveMobile'>
        <div className='archiveHeader'>
            <h2>
                Archive
            </h2>
            <button className='filter-lines' onClick={() => setFilterOpen(true)}>
                Filters
                <span className='filter-icon'>
                    <span></span>
                    <span></span>
                    <span></span>
                    {selected.length > 0 && (
                      <span className='filter-badge'>{selected.length}</span>
                    )}
                </span>
            </button>
        </div>
        {projects.map((project, index) => (
            <div
                key={index}
                className='archiverow'
            >
                <span>{project}</span>
                <span>2025</span>
            </div>
        ))}

        {filterOpen && (
          <div className='filterPage'>
            <button className='filterBack' onClick={() => setFilterOpen(false)}>
              ← back
            </button>
            <ul className='filterList'>
              {FILTERS.map((n) => {
                const isOn = selected.includes(n)
                return (
                  <li
                    key={n}
                    className={isOn ? 'filterOption on' : 'filterOption'}
                    onClick={() => toggleFilter(n)}
                  >
                    <span className='filterNum'>{n}</span>
                    {isOn && <span className='filterCheck'>✓</span>}
                  </li>
                )
              })}
            </ul>
          </div>
        )}
    </div>
  )
}

export default ArchiveMobile
