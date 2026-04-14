import Link from 'next/link'

export default function Breadcrumb() {
  return (
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
        Get a quote
      </span>
    </nav>
  )
}