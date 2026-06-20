import React from 'react'
import '../../styling/ArchiveMobile.css'

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
  return (
    <div className='archiveMobile'>
        <div className='archiveHeader'>
            <h2>
                Archive
            </h2>
            <h2 className='filter-lines'>
                Filters
                <span></span>
                <span></span>
                <span></span>
            </h2>
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
    </div>
  )
}

export default ArchiveMobile
