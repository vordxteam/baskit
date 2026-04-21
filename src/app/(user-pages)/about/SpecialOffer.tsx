import Image from 'next/image'
import Link from 'next/link'

export default function Specialoffer() {
  return (
    <section className="w-full relative">

      {/* Background Image */}
      <div className="relative w-full py-[122px] overflow-hidden max-w-[1440px] mx-auto px-5 sm:px-10 lg:pl-20 lg:pr-4">
        <Image
          src="/images/about-banner.png" 
          alt="Background"
          fill
          className="object-cover object-center -z-10"
          priority
        />

        {/* Centered Card */}
        <div className=" flex items-center justify-center">
          <div
            className="w-full max-w-[422px] bg-[#FAF2E6] flex flex-col items-center text-center py-[20px] px-[40px] gap-3"
            style={{ boxShadow: '0px 0px 20px 0px #00000014' }}
          >

            {/* Label */}
            <span className="text-[12px] font-light tracking-[0.15em] bg-[#E3879247] py-1 px-2 leading-4  text-[#25252599] font-normal">
              Special Offer
            </span>

            {/* Heading */}
            <h2 className="text-[28px] sm:text-[36px] tobia-normal text-[#252525] leading-10">
              Enjoy 20% Off Your First Bouquet!
            </h2>

            {/* Subtext */}
            <p className="text-[14px] font-normal leading-5 text-[#252525CC]">
              Save big on your first fresh delivery.
            </p>

            {/* CTA Button */}
            <Link
              href="/product"
              className="mt-2 py-3 px-5  bg-[#252525] text-white text-[14px] font-normal leading-5 flex items-center justify-center transition-colors duration-150 hover:bg-[#3a3a3a]"
            >
              Order your Baskit
            </Link>

          </div>
        </div>
      </div>

    </section>
  )
} 