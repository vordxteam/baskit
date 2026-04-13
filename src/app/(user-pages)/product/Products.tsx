// 'use client'

// import React, { useState } from 'react'
// import Image from 'next/image'
// import Button from '@/components/ui/button/Button'
// import { products } from '../../../../data/products'

// type Product = {
//     id: number
//     image: string
//     name: string
//     description: string
//     price: string
// }

// // const products: Product[] = [
// //     {
// //         id: 1,
// //         image: '/images/product1.png',
// //         name: 'Sunshine Mix',
// //         description: 'Bright, cheerful blooms that bring warmth',
// //         price: 'PKR 3,999',
// //     },
// //     {
// //         id: 2,
// //         image: '/images/product2.png',
// //         name: 'Tropical Vibes',
// //         description: 'Exotic blooms full of color and energy',
// //         price: 'PKR 6,999',
// //     },
// //     {
// //         id: 3,
// //         image: '/images/product3.png',
// //         name: 'Pastel Dreams',
// //         description: 'Soft pastel flowers creating an elegant look',
// //         price: 'PKR 4,999',
// //     },
// //     {
// //         id: 4,
// //         image: '/images/product4.png',
// //         name: 'Roses & Grace',
// //         description: 'A vibrant bouquet for friends and loved ones.',
// //         price: 'PKR 2,999',
// //     },
// //     {
// //         id: 5,
// //         image: '/images/product5.png',
// //         name: 'Joyful Blooms',
// //         description: 'A playful mix of fresh seasonal flowers',
// //         price: 'PKR 2,999',
// //     },
// //     {
// //         id: 6,
// //         image: '/images/product6.png',
// //         name: 'Pink Roses',
// //         description: 'Classic pink roses arranged to convey love',
// //         price: 'PKR 2,999',
// //     },
// //     {
// //         id: 7,
// //         image: '/images/product6.png',
// //         name: 'Pink Roses',
// //         description: 'Classic pink roses arranged to convey love',
// //         price: 'PKR 2,999',


// //     },
// //     {
// //         id: 8,
// //         image: '/images/product5.png',
// //         name: 'Joyful Blooms',
// //         description: 'A playful mix of fresh seasonal flowers',
// //         price: 'PKR 2,999',


// //     },
// //     {
// //         id: 9,
// //         image: '/images/product3.png',
// //         name: 'Pastel Dreams',
// //         description: 'Soft pastel flowers creating an elegant look',
// //         price: 'PKR 4,999',
// //     },
// //     {
// //         id: 10,
// //         image: '/images/product4.png',
// //         name: 'Roses & Grace',
// //         description: 'A vibrant bouquet for friends and loved ones.',
// //         price: 'PKR 2,999',
// //     },
// //     {
// //         id: 11,
// //         image: '/images/product2.png',
// //         name: 'Tropical Vibes',
// //         description: 'Exotic blooms full of color and energy',
// //         price: 'PKR 6,999',
// //     },
// //     {
// //         id: 12,
// //         image: '/images/product1.png',
// //         name: 'Sunshine Mix',
// //         description: 'Bright, cheerful blooms that bring warmth',
// //         price: 'PKR 3,999',
// //     },
// //     {
// //         id: 13,
// //         image: '/images/product6.png',
// //         name: 'Pink Roses',
// //         description: 'Classic pink roses arranged to convey love',
// //         price: 'PKR 2,999',


// //     },
// //     {
// //         id: 14,
// //         image: '/images/product5.png',
// //         name: 'Joyful Blooms',
// //         description: 'A playful mix of fresh seasonal flowers',
// //         price: 'PKR 2,999',


// //     },
// //     {
// //         id: 15,
// //         image: '/images/product3.png',
// //         name: 'Pastel Dreams',
// //         description: 'Soft pastel flowers creating an elegant look',
// //         price: 'PKR 4,999',
// //     },
// //     {
// //         id: 16,
// //         image: '/images/product4.png',
// //         name: 'Roses & Grace',
// //         description: 'A vibrant bouquet for friends and loved ones.',
// //         price: 'PKR 2,999',
// //     },
// // ]

// const ProductCard = ({ product }: { product: Product }) => {
//     const [wished, setWished] = useState(false)

//     return (
//         <div className="flex flex-col items-center text-center space-y-4 sm:space-y-6 group">
//             {/* Image */}
//             <div className="relative flex h-80 w-full items-center justify-center overflow-hidden px-3 py-5 transition-all duration-300 group-hover:bg-[#ebd9c7] sm:h-[280px] lg:h-80">
//                 <button
//                     onClick={() => setWished((w) => !w)}
//                     className="absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center hover:scale-110"
//                 >
//                     <svg
//                         width="22"
//                         height="22"
//                         fill={wished ? '#e05c5c' : 'none'}
//                         stroke={wished ? '#e05c5c' : '#252525'}
//                         strokeWidth="1.5"
//                         viewBox="0 0 24 24"
//                     >
//                         <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
//                     </svg>
//                 </button>

//                 <Image
//                     src={product.image}
//                     width={413}
//                     height={420}
//                     alt={product.name}
//                     className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
//                 />
//             </div>

//             {/* Info */}
//             <div className="space-y-1.5">
//                 <h3 className="text-[18px] sm:text-[20px] font-medium text-[#252525]">
//                     {product.name}
//                 </h3>
//                 <p className="text-[#252525CC] text-[13px] sm:text-[14px] leading-5">
//                     {product.description}
//                 </p>
//             </div>

//             {/* Price */}
//             <p className="text-[18px] sm:text-[20px] font-semibold text-[#252525]">
//                 {product.price}
//             </p>

//             {/* Button */}
//             <div className="w-full">
//                 <Button variant="primary" className="w-full">
//                     Add to Baskit
//                 </Button>
//             </div>
//         </div>
//     )
// }

// const AllProducts = () => {
//     return (
//         <section>

//             <h1 className='text-[#252525] tobia-normal leading-8 text-[32px]'>All Products (123)</h1>

//             {/* Grid Only */}
//             <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-10 sm:gap-y-12 lg:gap-y-16">
//                 {products.map((product) => (
//                     <ProductCard key={product.id} product={product} />
//                 ))}
//             </div>
//         </section>
//     )
// }

// export default AllProducts


import ProductGrid from '@/components/ui/ProductGrid'

const AllProducts = () => <ProductGrid />

export default AllProducts