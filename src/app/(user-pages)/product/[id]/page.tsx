import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { productDetails } from '../../../../../data/productDetails'
import { products } from '../../../../../data/products'
import RelatedProducts from '@/components/shop/RelatedProducts'
import AddToCart from '@/components/AddToCart'
export async function generateStaticParams() {
  return productDetails.map((p) => ({ id: String(p.id) }))
}

// interface PageProps {
//   params: { id: string }
// }
interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await Promise.resolve(params)
  const detail = productDetails.find((p) => p.id === Number(id))

  if (!detail) notFound()

  const related = products.filter((p) => p.id !== detail.id).slice(0, 3)

  return (
    <main className="w-full">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10">

        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 mt-5 flex-wrap" aria-label="Breadcrumb">
          <Link href="/" className="text-[14px] leading-5 font-light text-[#25252599] hover:text-[#252525] transition-colors">
            Home
          </Link>
          <span className="text-[14px] font-light text-[#25252599]">{`>`}</span>
          <Link href="/shop" className="text-[14px] leading-5 font-light text-[#25252599] hover:text-[#252525] transition-colors">
            Shop
          </Link>
          <span className="text-[14px] font-light text-[#25252599]">{`>`}</span>
          <span className="text-[14px] leading-5 font-light text-[#252525]">
            {detail.name}
          </span>
        </nav>

        {/* Product Section */}
        <section className="flex flex-col lg:flex-row gap-10 mt-5">

          {/* Left — Single large image */}
          <div className="w-full lg:w-1/2 flex-shrink-0">
            <div className="relative w-full aspect-[4/5] overflow-hidden">
              <Image
                src={detail.image}
                alt={detail.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* Right — Product info */}
          <div className="w-full lg:w-1/2 flex flex-col gap-6">

            {/* Name + Price */}
            <div className="space-y-5">
              <h1 className="text-[28px] sm:text-[36px] lg:text-[60px] font-medium text-[#252525] sm:leading-10 leading-9 lg:leading-[68px] tobia-normal">
                {detail.name}
              </h1>
              <p className="text-[18px] sm:text-[24px] tobia-normal leading-8 text-[#252525]">
                {detail.price}
              </p>
            </div>

            {/* Description */}
            <p className="text-[20px] leading-7 text-[#252525CC] max-w-[450px] sm:max-w-[580px] font-light">
              {detail.description}
            </p>

            {/* Includes list */}
            {detail.includes.length > 0 && (
              <div className="space-y-10">
                <p className="text-[20px] leading-7  text-[#252525CC] font-light">This hamper includes:</p>
                <ul className="space-y-1 pl-8">
                  {detail.includes.map((item, i) => (
                    <li key={i} className="text-[20px] leading-7 text-[#252525CC] font-light list-disc">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Add to cart — client component */}
            <AddToCart productName={detail.name} />

            {/* Info sections */}
            <div className="flex flex-col">
              {detail.sections.map((section) => (
                <div key={section.number} className="py-5 space-y-4">
                  <p className="text-[20px] leading-6 text-[#D35565] tobia-normal  tracking-wide  ">{section.number}</p>
                  <h3 className="text-[24px] leading-7  font-medium text-[#111111]">{section.title}</h3>
                  <p className="text-[16px]  leading-5 text-[#111111CC] font-normal border-[#25252533] border-b pb-10 ">{section.content}</p>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* Related Products */}
        <RelatedProducts products={related} />

      </div>
    </main>
  )
}