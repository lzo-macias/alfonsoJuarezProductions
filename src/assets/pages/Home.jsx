import { useRef, useState, useEffect, lazy, Suspense } from 'react'
import "../../styling/app.css"
import ComingSoon from '../components/ComingSoon'

const Cube = lazy(() => import('../components/Cube'))

const MOBILE_QUERY = '(max-width: 768px)'
const isMobileNow = () =>
  typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches

const fashionImages = [
  '1490481651871-ab68de25d43d',
  '1483985988355-763728e1935b',
  '1469334031218-e382a71b716b',
  '1496747611176-843222e1e57c',
  '1525507119028-ed4c629a60a3',
  '1485231183945-fffde7cc051e',
  '1487412720507-e7ab37603c6f',
  '1539109136881-3be0616acf4b',
  '1515886657613-9f3515b0c78f',
  '1502716119720-b23a93e5fe1b',
  '1492707892479-7bc8d5a4ee93',
  '1529139574466-a303027c1d8b',
  '1518049362265-d5b2a6467637',
  '1506629082955-511b1aa562c8',
  '1521577352947-9bb58764b69a',
  '1483118714900-540cf339fd46',
  '1475180098004-ca77a66827be',
  '1524504388940-b1c1722653e1',
].map((id) => `https://images.unsplash.com/photo-${id}?w=320&h=320&fit=crop&auto=format&q=60`)


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

const filterOptions = ['1', '2', '3', '4', '5', '6', '7']

const topfive = [
  'Basketcase x New Balance Pelle Cass',
  'Basketcase x New Balance World Cup Campaign',
  'Mangox Eckhaus Latta Collaboration',
  'Eckhaus Latta Seen Campaign',
  'Eckhaus Latta SS26',
]

const imagesFor = (index) => {
  if (index === -1) {
    return []
  }else{
    return [fashionImages[index], fashionImages[index+1]]
  }

}



function Home() {
  const leftRef = useRef(null)
  const rightRef = useRef(null)
  const scroll = useRef({ velocity: 0, lastTop: 0 })
  const [preselected] = useState(() => Math.floor(Math.random() * topfive.length))
  const [isMobile, setIsMobile] = useState(isMobileNow)
  const [hovered, setHovered] = useState(() => (isMobileNow() ? preselected : -1))
  const [filters, setFilters] = useState([])
  const addFilter = (f) => setFilters((prev) => (prev.includes(f) ? prev : [...prev, f]))
  const removeFilter = (f) => setFilters((prev) => prev.filter((x) => x !== f))
  const [showCube, setShowCube] = useState(false)
  const [previewHidden, setPreviewHidden] = useState(false)
  const [activeTop, setActiveTop] = useState(preselected)
  const [comingSoon, setComingSoon] = useState(false)

  const handleTopClick = (index) => {
    if (activeTop === index) {
      setComingSoon(true)
    } else {
      setActiveTop(index)
      setHovered(index)
    }
  }
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY)
    const onChange = (e) => setIsMobile(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    const onWheel = (e) => {
      if (!leftRef.current) return
      if (leftRef.current.offsetParent === null) return
      e.preventDefault()
      leftRef.current.scrollTop += e.deltaY
    }
    window.addEventListener('wheel', onWheel, { passive: false })
    return () => window.removeEventListener('wheel', onWheel)
  }, [])

  useEffect(() => {
    const onMove = (e) => {
      const list = leftRef.current
      if (!list) return
      const items = list.querySelectorAll('.projectListContainer')
      if (!items.length) return
      const firstTop = items[0].getBoundingClientRect().top
      const lastBottom = items[items.length - 1].getBoundingClientRect().bottom
      setPreviewHidden(e.clientY < firstTop || e.clientY > lastBottom)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  const handleLeftScroll = () => {
    const top = leftRef.current.scrollTop
    scroll.current.velocity += Math.abs(top - scroll.current.lastTop)
    scroll.current.lastTop = top
  }

  return (
    <div className={showCube ? 'home cubeMode' : 'home'}>
        <div className='mainContainer'>
            <div className='leftSide' ref={leftRef} onScroll={handleLeftScroll}>
                <ul className='projects'>
                    {projects.map((project, index) => (
                      <li
                        key={index}
                        className={
                          hovered === index
                            ? 'projectListContainer hovered'
                            : 'projectListContainer'
                        }
                        onMouseEnter={() => setHovered(index)}
                        onMouseLeave={showCube ? () => setHovered(-1) : undefined}
                      >
                        {project}
                      </li>
                    ))}
                </ul>
            </div>
            <div className='rightSide' ref={rightRef}>
                <div className='buttons'>
                    <div className='twomain'>
                        <div className='filterWrap'>
                          <button className='filter'>filter</button>
                          <ul className='optionfilters'>
                            {filterOptions
                              .filter((opt) => !filters.includes(opt))
                              .map((opt) => (
                                <li key={opt} onClick={() => addFilter(opt)}>{opt}</li>
                              ))}
                          </ul>
                        </div>
                        {filters.length > 0 && (
                          <div className='selectedFilters'>
                            {filters.map((f) => (
                              <span className='filterChip' key={f}>
                                <button
                                  className='chipX'
                                  onClick={() => removeFilter(f)}
                                  aria-label={`remove ${f}`}
                                >×</button>
                                {f}
                              </span>
                            ))}
                          </div>
                        )}
                        <button>archive</button>
                    </div>
                    <div className='info'>
                      <button>Info</button>
                    </div>
                  <div className='mobilebuttons'>
                      <button className='archive'>archive</button>
                      <button>home</button>
                      <button className='info'>Info</button>
                  </div>
                </div>
                <ul className='topfive'>
                    {topfive.map((top, index) => (
                    <li
                      key={index}
                      className={hovered === index || activeTop === index ? 'hovered' : ''}
                      onMouseEnter={() => setHovered(index)}
                      onClick={() => handleTopClick(index)}
                    >
                      {top}
                    </li>
                    ))}
                </ul>
                {(isMobile || showCube) && (
                  <Suspense fallback={null}>
                    <Cube images={fashionImages} scroll={scroll} hovered={hovered} />
                  </Suspense>
                )}
                {!showCube && hovered >= 0 && !previewHidden && (
                  <div className='previewContainer' key={hovered}>
                    {imagesFor(hovered).map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt=''
                        className='previewImg'
                        loading='lazy'
                        decoding='async'
                      />
                    ))}
                  </div>
                )}
                <div className='titleCards'>
                    <h1>ALFONSO JUAREZ,</h1>
                    <h2>EXECUTIVE PRODUCER</h2>
                    <button
                      className='cubeToggle'
                      onClick={() => {
                        if (!showCube) setHovered(-1)
                        setShowCube((v) => !v)
                      }}
                    >
                      {showCube ? 'the work' : 'the cube'}
                    </button>
                </div>
            </div>
        </div>
        {comingSoon && (
          <ComingSoon
            onBack={() => { setComingSoon(false); setActiveTop(-1) }}
          />
        )}
    </div>
  )
}

export default Home
