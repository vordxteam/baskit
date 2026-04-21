'use client'

import Button from '@/components/ui/button/Button'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'

const HowToCreate = () => {

    const router = useRouter()
    return (
        <div className='pb-10 lg:py-20 max-w-[1440px] mx-auto'>
            <div className='grid grid-cols-1 lg:grid-cols-2'>
                <div className='relative w-full h-full min-h-[300px] lg:min-h-[720px] overflow-hidden order-2 lg:order-1'>
                    <video
                        src="/how-to-create.mp4"
                        muted
                        autoPlay
                        loop
                        playsInline
                        className='absolute top-0 left-0 w-full h-full object-cover'
                    />
                </div>

                <div className='p-4 md:py-10 md:px-15 flex flex-col h-full justify-between gap-10 order-1 lg:order-2'>
                    <div className='space-y-10'>
                        <div className='space-y-2'>
                            <h1 className='text-[#252525] text-[40px] md:text-[48px] tobia-normal leading-12 md:leading-14'>How to create your Baskit?</h1>
                            <p className='max-w-[506px] text-[#252525CC] text-[20px] font-normal leading-7'>Follow a few easy steps to customize your Baskit with your favorite items and create a gift that feels truly personal.</p>
                        </div>

                        <div className='space-y-5'>
                            <div>
                                <h4 className='text-[#D35565] text-[20px] tobia-normal leading-6'>- 01 - </h4>
                                <h1 className='text-[#252525] text-[24px] tobia-normal leading-7'>Select your Baskit</h1>
                                <p className='text-[#252525CC] text-[16px] font-normal leading-6'>Choose the basket style that fits your occasion and preference.</p>
                            </div>

                            <div>
                                <h4 className='text-[#D35565] text-[20px] tobia-normal leading-6'>- 02 - </h4>
                                <h1 className='text-[#252525] text-[24px] tobia-normal leading-7'>Curate your Baskit</h1>
                                <p className='text-[#252525CC] text-[16px] font-normal leading-6'>Add handpicked items to create a thoughtful and unique combination.</p>
                            </div>

                            <div>
                                <h4 className='text-[#D35565] text-[20px] tobia-normal leading-6'>- 03 - </h4>
                                <h1 className='text-[#252525] text-[24px] tobia-normal leading-7'>Personalize your gift</h1>
                                <p className='text-[#252525CC] text-[16px] font-normal leading-6'>Include a message or details to make your gift truly special.</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <Button onClick={() => router.push('/get-a-qoute')} variant='primary' className='w-full'>
                            Create your Baskit
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HowToCreate