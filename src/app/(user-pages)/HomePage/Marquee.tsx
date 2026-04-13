import React from 'react'

const Marquee = () => {
  const items = ['Customization', 'Instant delivery', '24/7 Support', 'High quality Baskit']
  const repeatedItems = Array.from({ length: 4 }, () => items).flat()

  return (
    <div className='border-b border-[#25252533] py-4 sm:py-5 overflow-hidden'>
      <div className='marquee-track'>
        <ul className='marquee-group'>
          {repeatedItems.map((item, index) => (
            <li key={`first-${index}`} className='marquee-item'>
              <span>{item}</span>
              <span className='mx-4 text-[#25252566]'>•</span>
            </li>
          ))}
        </ul>
        <ul className='marquee-group' aria-hidden='true'>
          {repeatedItems.map((item, index) => (
            <li key={`second-${index}`} className='marquee-item'>
              <span>{item}</span>
              <span className='mx-4 text-[#25252566]'>•</span>
            </li>
          ))}
        </ul>
      </div>

      <style jsx>{`
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee-scroll 30s linear infinite;
          will-change: transform;
        }

        .marquee-group {
          display: flex;
          align-items: center;
          flex-shrink: 0;
          white-space: nowrap;
        }

        .marquee-item {
          display: inline-flex;
          align-items: center;
          color: #25252599;
          font-size: 12px;
          font-weight: 400;
          line-height: 1.4;
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }

        @keyframes marquee-scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        @media (max-width: 1024px) {
          .marquee-track {
            animation-duration: 22s;
          }
        }

        @media (max-width: 640px) {
          .marquee-track {
            animation-duration: 18s;
          }
        }
      `}</style>
    </div>
  )
}

export default Marquee