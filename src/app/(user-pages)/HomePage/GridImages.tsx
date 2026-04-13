import Image from 'next/image'
import React from 'react'

const gridItems = [
    {
        id: 1,
        image: '/images/box1.png',
        title: 'Celebration hampers',
        description: 'Top gift hampers for birthdays, anniversaries, and special occasions.',
    },
    {
        id: 2,
        image: '/images/box2.png',
        title: 'Luxury flowers',
        description: 'Premium floral arrangements for memorable and elegant gifting moments.',
    },
    {
        id: 3,
        image: '/images/box3.png',
        title: 'Seasonal picks',
        description: 'Fresh and vibrant bouquets handpicked for every season and mood.',
    },
    {
        id: 4,
        image: '/images/box4.png',
        title: 'Curated boxes',
        description: 'Thoughtfully curated gift boxes that blend style, taste, and care.',
    },
]

const GridImages = () => {
    return (
        <div className='px-3 md:px-20 grid sm:grid-cols-2 gap-2 max-w-[1440px] mx-auto'>
            {gridItems.map((item) => (
                <article className='group relative w-full overflow-hidden'>
                    <Image
                        src={item.image}
                        width={636}
                        height={500}
                        alt={item.title}
                        className='h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]'
                    />

                    {/* 🔥 Sliding Overlay */}
                    <div className='absolute inset-0 bg-black/70 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out flex items-center justify-center'>

                        {/* Centered Content */}
                        <div className='text-center text-white px-6'>
                            <h3 className='text-[28px] leading-tight tobia-normal'>
                                {item.title}
                            </h3>

                            <p className='mx-auto mt-2 max-w-[420px] text-[16px] leading-7 text-white/90'>
                                {item.description}
                            </p>
                        </div>

                    </div>
                </article>
            ))}
        </div>
    )
}

export default GridImages