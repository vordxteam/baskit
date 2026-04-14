// 'use client'

// import Image from 'next/image'
// import Link from 'next/link'

// // ── Breadcrumb ────────────────────────────────────────────────────────────────

// const Breadcrumb = () => (
//   <nav className="flex items-center gap-2">
//     <Link href="/" className="text-[14px] font-light text-[#25252599] hover:text-[#252525] transition-colors leading-5">
//       Home
//     </Link>
//     <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
//       <path d="M1 1L5 5L1 9" stroke="#25252599" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
//     </svg>
//     <Link href="/product" className="text-[14px] font-light text-[#25252599] hover:text-[#252525] transition-colors leading-5">
//       Shop
//     </Link>
//     <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
//       <path d="M1 1L5 5L1 9" stroke="#25252599" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
//     </svg>
//     <span className="text-[14px] font-light text-[#252525] leading-5">
//       Order your Baskit
//     </span>
//   </nav>
// )

// // ── Summary Row ───────────────────────────────────────────────────────────────

// const SummaryRow = ({
//   label,
//   value,
//   isBold = false,
// }: {
//   label: string
//   value: string
//   isBold?: boolean
// }) => (
//   <div className="flex items-center justify-between py-4 px-3 tobia-normal  border-b border-[#25252520] last:border-b-0">
//     <span className={`text-[16px] leading-5 text-[#252525CC]`}>
//       {label}
//     </span>
//     <span className={`text-[16px] leading-5 text-[#252525]}`}>
//       {value}
//     </span>
//   </div>
// )

// // ── Main Page ─────────────────────────────────────────────────────────────────

// export default function BouqetsSummary() {

//   // Replace these with real data from your state/cart later
//   const summary = [
//     { label: 'Bouquet type',          value: 'Wrapper bouquet' },
//     { label: 'Bouquet size',          value: 'Large'           },
//     { label: 'Bouquet wrap',          value: 'Pastel pink wrap'},
//     { label: 'Ribbon color',          value: 'White'           },
//     { label: 'White flowers - 8 pieces', value: 'PKR 3,999'   },
//     { label: 'Baby breaths - 4 pieces',  value: 'PKR 1,499'   },
//     { label: 'Total',                 value: 'PKR 4,500', bold: true },
//   ]

//   return (
//     <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-10 py-8">

//       {/* Breadcrumb */}
//       <Breadcrumb />

//       {/* Content */}
//       <div className="flex flex-col items-center mt-10">

//         {/* Illustration */}
//         <div className="relative w-[180px] h-[180px] sm:w-[200px] sm:h-[200px]">
//           {/* Replace src with your actual illustration */}
//           <Image
//             src="/images/bouqet-summary.png"
//             fill
//             alt="Bouquet illustration"
//             className="object-contain"
//           />
//         </div>

//         {/* Title */}
//         <h1 className="text-[28px] sm:text-[32px] tobia-normal text-[#252525] mt-5 mb-8">
//           Bouquet summary
//         </h1>

//         {/* Summary Table */}
//         <div className="w-full max-w-150  border border-[#25252520]">
//           {summary.map((row, i) => (
//             <SummaryRow
//               key={i}
//               label={row.label}
//               value={row.value}
//               isBold={row.bold}
//             />
//           ))}
//         </div>

//         {/* Buttons */}
//         <div className="flex sm:flex-row flex-col items-center gap-4 mt-10 sm:mt-15">
//           <button
//             onClick={() => history.back()}
//             className="border border-[#252525] text-[18px] font-regular text-[#252525] px-7 py-3 hover:bg-[#f5f0e8] transition-colors"
//           >
//             Go back
//           </button>
//           <button
//             onClick={() => console.log('Add to Baskit', summary)}
//             className="bg-[#252525] text-white text-[18px] font-regular px-5 py-3 hover:opacity-90 transition-opacity"
//           >
//             Add to Baskit
//           </button>
//         </div>

//       </div>
//     </div>
//   )
// }

'use client'

import Image from 'next/image'
import Link from 'next/link'

// ── Breadcrumb ────────────────────────────────────────────────────────────────

const Breadcrumb = () => (
  <nav className="flex items-center gap-2">
    <Link href="/" className="text-[14px] font-light text-[#25252599] hover:text-[#252525] transition-colors leading-5">
      Home
    </Link>
    <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
      <path d="M1 1L5 5L1 9" stroke="#25252599" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <Link href="/product" className="text-[14px] font-light text-[#25252599] hover:text-[#252525] transition-colors leading-5">
      Shop
    </Link>
    <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
      <path d="M1 1L5 5L1 9" stroke="#25252599" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <span className="text-[14px] font-light text-[#252525] leading-5">
      Order your Baskit
    </span>
  </nav>
)

// ── Summary Row ───────────────────────────────────────────────────────────────

const SummaryRow = ({
  label,
  value,
  isLast = false,
}: {
  label: string
  value: string
  isLast?: boolean
}) => (
  <div className="px-3">
    <div className={`flex items-center justify-between py-4 tobia-normal ${!isLast ? 'border-b border-[#25252520]' : ''}`}>
      <span className="text-[16px] leading-5 text-[#252525CC]">{label}</span>
      <span className="text-[16px] leading-5 text-[#252525]">{value}</span>
    </div>
  </div>
)

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function BouqetsSummary() {

  const summary = [
    { label: 'Bouquet type',             value: 'Wrapper bouquet' },
    { label: 'Bouquet size',             value: 'Large'           },
    { label: 'Bouquet wrap',             value: 'Pastel pink wrap'},
    { label: 'Ribbon color',             value: 'White'           },
    { label: 'White flowers - 8 pieces', value: 'PKR 3,999'      },
    { label: 'Baby breaths - 4 pieces',  value: 'PKR 1,499'      },
    { label: 'Total',                    value: 'PKR 4,500'       },
  ]

  return (
    <div className="max-w-[1440px] mx-auto px-5 sm:px-10 py-8">

      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Content */}
      <div className="flex flex-col items-center mt-10">

        {/* Illustration */}
        <div className="relative w-[180px] h-[180px] sm:w-[200px] sm:h-[200px]">
          <Image
            src="/images/bouqet-summary.png"
            fill
            alt="Bouquet illustration"
            className="object-contain"
          />
        </div>

        {/* Title */}
        <h1 className="text-[28px] sm:text-[32px] tobia-normal text-[#252525] mt-5 mb-8">
          Bouquet summary
        </h1>

        {/* Summary Table */}
        <div className="w-full max-w-150 border border-[#25252520]">
          {summary.map((row, i) => (
            <SummaryRow
              key={i}
              label={row.label}
              value={row.value}
              isLast={i === summary.length - 1}
            />
          ))}
        </div>

        {/* Buttons */}
        <div className="flex flex-col justify-center sm:flex-row gap-4 mt-10 sm:mt-15 w-full max-w-150">
          <button
            onClick={() => history.back()}
            className="w-full sm:w-auto border border-[#252525] text-[18px] text-[#252525] px-7 py-3 hover:bg-[#f5f0e8] transition-colors"
          >
            Go back
          </button>
          <button
            onClick={() => console.log('Add to Baskit', summary)}
            className="w-full sm:w-auto bg-[#252525] text-white text-[18px] px-5 py-3 hover:opacity-90 transition-opacity"
          >
            Add to Baskit
          </button>
        </div>

      </div>
    </div>
  )
}