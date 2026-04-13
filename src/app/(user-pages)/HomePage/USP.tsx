import Image from 'next/image'
import React from 'react'

const USP = () => {
    return (
        <div className='max-w-[1440px] mx-auto mt-10 md:mt-20'>
            <div className='border border-[#25252552] grid grid-cols-1 md:grid-cols-3'>
                <div className='px-3 pt-3 pb-15 space-y-10 flex flex-col items-center justify-center border-r border-[#25252552]'>
                    <Image
                        src="/images/usp1.png"
                        alt="USP Icon 1"
                        width={456}
                        height={456}
                    />
                    <div className='space-y-3 flex flex-col items-center justify-center text-center'>
                        <h1 className='text-[28px] tobia-normal leading-8'>Deliver with quality</h1>

                        <p className='max-w-[360px] text-[16px] font-light leading-5'>Every detail matters from handpicked items to packaging.</p>
                    </div>
                </div>
                <div className='px-3 pt-3 pb-15 space-y-10 flex flex-col items-center justify-center border-r border-[#25252552]'>
                    <Image
                        src="/images/usp2.png"
                        alt="USP Icon 1"
                        width={456}
                        height={456}
                    />
                    <div className='space-y-3 flex flex-col items-center justify-center text-center'>
                        <h1 className='text-[28px] tobia-normal leading-8'>Deliver on same day</h1>

                        <p className='max-w-[360px] text-[16px] font-light leading-5'>From order to delivery in just hours, right when it matters most.</p>
                    </div>
                </div>
                <div className='px-3 pt-3 pb-15 space-y-10 flex flex-col items-center justify-center'>
                    <Image
                        src="/images/usp3.png"
                        alt="USP Icon 1"
                        width={456}
                        height={456}
                    />
                    <div className='space-y-3 flex flex-col items-center justify-center text-center'>
                        <h1 className='text-[28px] tobia-normal leading-8'>Curated for you</h1>

                        <p className='max-w-[360px] text-[16px] font-light leading-5'>Thoughtfully assembled gifts that feel personal, not generic.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default USP