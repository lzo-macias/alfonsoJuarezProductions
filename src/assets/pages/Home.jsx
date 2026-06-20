import React, { useRef, useState, useEffect } from 'react'
import "../../styling/app.css"
import Cube from '../components/Cube'
import Sliders from '../components/Sliders'
import ComingSoon from '../components/ComingSoon'
import { div } from 'three/tsl'

// fashion / runway stock photos (Unsplash — CORS-enabled so WebGL can texture them).
// swap these for your own by dropping files in /public/img and listing them here.
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
].map((id) => `https://images.unsplash.com/photo-${id}?w=500&h=500&fit=crop&auto=format&q=70`)


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

// options shown in the filter dropdown — edit these labels to your real filters
const filterOptions = ['1', '2', '3', '4', '5', '6', '7']

const topfive = [
  'Basketcase x New Balance Pelle Cass',
  'Basketcase x New Balance World Cup Campaign',
  'Mangox Eckhaus Latta Collaboration',
  'Eckhaus Latta Seen Campaign',
  'Eckhaus Latta SS26',
]

// Pick the images that belong to a hovered project. For now this is a stable
// slice of the shared list so each project shows a different set. Replace this
// with a real { projectIndex: [urls] } mapping once you have per-project photos.
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
  // shared scroll signal the cube reads every frame (velocity = how fast you're scrolling)
  const scroll = useRef({ velocity: 0, lastTop: 0 })
  // which project is hovered -> drives the teal text + the cube's panel selection.
  // on mobile we boot with index 2 (Mangox Eckhaus Latta Collaboration) selected so
  // the cube loads fully expanded, matching the pre-selected top-five item. desktop
  // boots idle (-1) so its load is unchanged.
  const [hovered, setHovered] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches ? 2 : -1
  )
  // filters the user has picked from the dropdown -> shown as chips by the buttons
  const [filters, setFilters] = useState([])
  const addFilter = (f) => setFilters((prev) => (prev.includes(f) ? prev : [...prev, f]))
  const removeFilter = (f) => setFilters((prev) => prev.filter((x) => x !== f))
  // toggles the interactive cube into the preview slot (instead of the image preview)
  const [showCube, setShowCube] = useState(false)
  // top-five (mobile) two-tap: first tap selects/expands an item, second tap on the
  // SAME item navigates to the coming-soon page. activeTop = which one is "armed".
  // start with the 3rd top-five item (index 2 — left of the middle row on mobile)
  // pre-selected: it loads in dark (#1A1A1A) and takes a single tap to navigate.
  const [activeTop, setActiveTop] = useState(2)
  const [comingSoon, setComingSoon] = useState(false)

  const handleTopClick = (index) => {
    if (activeTop === index) {
      setComingSoon(true)          // second tap -> go to the page
    } else {
      setActiveTop(index)          // first tap -> arm + expand
      setHovered(index)            // the cube reacts to the selection
    }
  }
  // scrolling ANYWHERE on the page scrolls the project list. listen on window
  // (native, non-passive) so preventDefault() stops the page from scrolling and
  // we redirect the wheel delta into the list instead.
  useEffect(() => {
    const onWheel = (e) => {
      if (!leftRef.current) return
      // only hijack the wheel when the desktop list is actually on screen.
      // on mobile .leftSide is display:none (offsetParent === null), so let the
      // page scroll natively — otherwise preventDefault traps the page and you
      // can never scroll down to the archive below the hero.
      if (leftRef.current.offsetParent === null) return
      e.preventDefault()
      leftRef.current.scrollTop += e.deltaY
    }
    window.addEventListener('wheel', onWheel, { passive: false })
    return () => window.removeEventListener('wheel', onWheel)
  }, [])

  // measure how far the list moved this tick -> feed the cube's pulse
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
                    <div key={index} className='projectListContainer'>
                      <li
                        className={hovered === index ? 'hovered' : ''}
                        onMouseEnter={() => setHovered(index)}
                        // cube mode: reset on leave so the cube returns to normal when
                        // not directly over an item. preview mode: stay sticky (no reset).
                        onMouseLeave={showCube ? () => setHovered(-1) : undefined}
                      >
                      {project}
                    </li>
                    </div>

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
                <div className = "topfive">
                    {topfive.map((top, index) => (
                    <li
                      key={index}
                      className={hovered === index || activeTop === index ? 'hovered' : ''}
                      onMouseEnter={() => setHovered(index)}
                      onMouseLeave={() => setHovered(-1)}
                      onClick={() => handleTopClick(index)}
                    >
                      {top}
                    </li>
                    ))}
                </div>
                {/* Both are always rendered; CSS picks which is visible per breakpoint.
                    Desktop hides .cube-canvas (sliders show on hover); mobile hides
                    .sliders (the cube stays and reacts to `hovered`). */}
                <Cube images={fashionImages} scroll={scroll} hovered={hovered} />
                {/* charcoal preview slides in on hover — hidden while the cube is shown */}
                {!showCube && hovered >= 0 && (
                  <div className='previewContainer' key={hovered}>
                    {imagesFor(hovered).map((src, i) => (
                      <img key={i} src={src} alt='' className='previewImg' />
                    ))}
                  </div>
                )}
                <div className='titleCards'>
                    <h1>ALFONSO JUAREZ,</h1>
                    <h2>EXECUTIVE PRODUCER</h2>
                    <button
                      className='cubeToggle'
                      onClick={() => {
                        if (!showCube) setHovered(-1)   // entering cube mode -> start idle
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
