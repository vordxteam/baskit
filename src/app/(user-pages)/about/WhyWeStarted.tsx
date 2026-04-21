import Image from 'next/image'
import Link from 'next/link'

export default function WhyWeStarted() {
  return (
    <section className="w-full max-w-[1440px] mx-auto px-5 sm:px-10 lg:pl-20 lg:pr-4 my-20">
      <div className="flex flex-col lg:flex-row items-stretch gap-0">

        {/* Left — Text */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center gap-5">
          <h2 className="text-[36px] sm:text-[48px] leading-10  sm:leading-14 tobia-normal text-[#252525]">
            Why we started Baskit
          </h2>

          <div className="space-y-5">
            <p className="text-[20px] leading-7 text-[#252525CC] font-light max-w-[524px]">
       We’ve all been there remembering an important moment too late, struggling to find the right gift, or settling for something that just doesn’t feel personal. Baskit was built to change that.
            </p>
            <p className="text-[20px] leading-7 text-[#252525CC] font-light max-w-[524px]">
        We wanted to create a simple way to send thoughtful, beautifully curated gifts without the stress, the delays, or the guesswork. Based in Lahore, we’re committed to thoughtful design, premium blooms, and warm, personal service. Whether you`&apos;`re celebrating, surprising someone special, or sharing a smile, we’re here to help you express it beautifully.
            </p>
          </div>

          <div className="flex items-center gap-4 mt-2">
            <Link
              href="/product"
              className="h-[46px] px-6 bg-[#252525] text-white text-[14px] tobia-normal leading-5 flex items-center justify-center transition-colors duration-150 hover:bg-[#3a3a3a]"
            >
              Browse products
            </Link>
            <Link
              href="/contact"
              className="h-[46px] px-6 border border-[#252525] text-[#252525] text-[14px] tobia-normal leading-5 flex items-center justify-center transition-colors duration-150 hover:bg-[#25252508]"
            >
              Contact us
            </Link>
          </div>
        </div>

        {/* Right — Image */}
        <div className="w-full lg:w-1/2 mt-10 lg:mt-0">
            <Image
              src="/images/why-we-started.png" 
              alt="Baskit team"
              width={740}
              height={492}
              className="w-full h-auto object-cover object-top"
              priority
            />
          
        </div>
         <div className="border-t border-[#25252514] mb-12" />
      </div>
    </section>
  )
}