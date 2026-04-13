import Button from '@/components/ui/button/Button'
import Image from 'next/image'
import React from 'react'

const HeroSection = () => {
  return (
    <div className='border-b border-[#25252533] bg-[url("/images/bgvector.png")] bg-top-left lg:bg-bottom-right bg-no-repeat'>
      
      <div className='grid grid-cols-12 max-w-[1440px] mx-auto gap-6 lg:gap-11 px-6 lg:px-0'>

        {/* IMAGE */}
        <div className='col-span-12 lg:col-span-5 order-2 lg:order-1 flex items-center justify-center'>
          <Image
            src="/images/HeroBanner.svg"
            width={654}
            height={752}
            alt="hero"
            className='lg:w-full'
          />
        </div>

        {/* CONTENT */}
        <div className='col-span-12 lg:col-span-7 relative order-1 lg:order-2'>
          
          <div className='max-w-[520px] w-full h-full flex flex-col justify-center lg:justify-end lg:py-12 lg:pb-[140px]'>

            {/* ICON */}
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" fill="none">
                <path d="M7.3786 31.7233C..." fill="#252525"/>
              </svg>
            </div>

            {/* TEXT */}
            <div className='mt-5 space-y-4'>
              <h1 className='text-[#252525] text-[32px] sm:text-[40px] lg:text-[56px] leading-[40px] sm:leading-[48px] lg:leading-[60px] tobia-normal'>
                Create your perfect bouquet and Baskit
              </h1>

              <p className='text-[#252525B8] text-[16px] sm:text-[18px] lg:text-[20px] font-light leading-6 sm:leading-7'>
                Customize every detail, from flowers to gifts, and design truly personal for every special moment.
              </p>
            </div>

            {/* BUTTONS */}
            <div className='flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-8 lg:mt-[60px]'>
              <Button variant='primary' className='w-full sm:w-auto'>
                Shop now
              </Button>

              <Button variant='outline' className='w-full sm:w-auto'>
                Customize your Baskit
              </Button>
            </div>
          </div>

          {/* DECORATION IMAGES */}

          {/* Top image */}
          <div className='hidden lg:block absolute right-20 top-16'>
            <Image src="/images/hero1.svg" width={140} height={140} alt="hero" />
          </div>

          {/* Bottom image */}
          <div className='hidden lg:block absolute right-0 bottom-0'>
            <Image src="/images/hero2.svg" width={140} height={140} alt="hero" />
          </div>

        </div>
      </div>
    </div>
  )
}

export default HeroSection