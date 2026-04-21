import Link from 'next/link'
import { notFound } from 'next/navigation'
import { productDetails } from '../../../../../data/productDetails'
import { products } from '../../../../../data/products'
import RelatedProducts from '@/components/shop/RelatedProducts'
import ProductDetailsPurchase from '@/components/shop/ProductDetailsPurchase'
import { UserProduct } from '@/api/userProducts'
import type { ApiProduct } from '@/api/userProducts/types'
import ImageWithEmptyState from '@/components/ui/ImageWithEmptyState'

interface PageProps {
  params: Promise<{ id: string }>
}

type ProductDetailApi = ApiProduct & {
  items?: Array<{
    id: string
    name: string
    quantity: number
  }>
  sizes?: Array<{
    id: string
    size_code: string
    label: string
    price: string
    compare_at_price?: string
    is_active?: boolean
    fillers?: string[]
    colors?: {
      decorative_colors?: string[]
      net?: string[]
      product_color?: string[]
      ribbon?: string[]
    }
  }>
}

const PRODUCT_STATIC_STEPS = [
  {
    number: '- 01 -',
    title: 'A note about substitutions',
    content:
      'We handcraft most of our products in small batches and source ingredients from local businesses. As availability may vary, we may substitute an item with one of equal or greater value while maintaining our quality standards.',
  },
  {
    number: '- 02 -',
    title: 'Greeting cards instructions',
    content:
      'A complimentary greeting card is included with every order. You can choose a blank card or add a custom message up to 180 characters by entering it during checkout. Your message will also appear in your order confirmation email.',
  },
  {
    number: '- 03 -',
    title: 'Disclaimer',
    content:
      'Please note that lals may modify our product packaging slightly based on the availability of raw materials. These updates are made with care to maintain our high quality standards.',
  },
]

const toAbsoluteMediaUrl = (url?: string | null) => {
  if (!url) return null
  if (url.startsWith('http://') || url.startsWith('https://')) return url

  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'
  return `${apiBase}${url.startsWith('/') ? url : `/${url}`}`
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await Promise.resolve(params)
  const localDetail = productDetails.find((p) => p.id === Number(id))
  let apiDetail: ProductDetailApi | null = null

  try {
    const userProductApi = new UserProduct()
    apiDetail = await userProductApi.getProductById(id)

    console.log('API Detail:', apiDetail)
  } catch (error) {
    console.error('Failed to fetch product detail:', error)
  }

  if (!apiDetail && !localDetail) notFound()

  const detailName = apiDetail?.name ?? localDetail?.name ?? ''
  const detailImage = toAbsoluteMediaUrl(apiDetail?.base_image_url)
  const detailPrice = apiDetail?.price ?? localDetail?.price ?? ''
  const detailDescription =
    apiDetail?.description ??
    apiDetail?.short_description ??
    localDetail?.description ??
    ''
  const mediaImages = (apiDetail?.media ?? [])
    .map((media) => toAbsoluteMediaUrl(media.media_url))
    .filter((url): url is string => Boolean(url))

  const apiItems: { id: string; name: string; quantity: number }[] = (apiDetail?.items ?? []).map(
    (item: any) => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
    })
  )

  // Map sizes from API response
  const sizes = (apiDetail?.sizes ?? []).map((size: any) => ({
    id: size.id,
    size_code: size.size_code,
    label: size.label,
    price: size.price,
    compare_at_price: size.compare_at_price,
    is_active: size.is_active,
    fillers: (size.fillers ?? []) as string[],
    colors: size.colors
      ? {
          decorative_colors: size.colors.decorative_colors ?? [],
          net: size.colors.net ?? [],
          product_color: size.colors.product_color ?? [],
          ribbon: size.colors.ribbon ?? [],
        }
      : undefined,
  }))

  const related = products
    .filter((p) => p.id !== localDetail?.id)
    .slice(0, 3)

  return (
    <main className="w-full">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10">

        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 mt-5 flex-wrap" aria-label="Breadcrumb">
          <Link href="/" className="text-[14px] leading-5 font-light text-[#25252599] hover:text-[#252525] transition-colors">
            Home
          </Link>
          <span className="text-[14px] font-light text-[#25252599]">{`>`}</span>
          <Link href="/product" className="text-[14px] leading-5 font-light text-[#25252599] hover:text-[#252525] transition-colors">
            Shop
          </Link>
          <span className="text-[14px] font-light text-[#25252599]">{`>`}</span>
          <span className="text-[14px] leading-5 font-light text-[#252525]">
            {detailName}
          </span>
        </nav>

        {/* Product Section */}
        <section className="flex flex-col lg:flex-row gap-10 mt-5">

          {/* Left — Single large image */}
          <div className="w-full lg:w-1/2 space-y-2" style={{ flexShrink: 0 }}>
            <div className="relative w-full overflow-hidden bg-[#F5F1E8]" style={{ aspectRatio: '4 / 5' }}>
              <ImageWithEmptyState
                src={detailImage}
                alt={detailName}
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* Right — Product info */}
          <ProductDetailsPurchase
            productId={id}
            detailName={detailName}
            detailImage={detailImage}
            detailPrice={detailPrice}
            detailDescription={detailDescription}
            sizes={sizes}
            apiItems={apiItems}
            localIncludes={localDetail?.includes ?? []}
          />
        </section>

        <section className="flex items-center gap-10">

          <div className='w-1/2'>
            {mediaImages.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {mediaImages.map((imageUrl, index) => (
                  <div key={`${imageUrl}-${index}`} className="relative aspect-square overflow-hidden bg-[#F5F1E8]">
                    <ImageWithEmptyState
                      src={imageUrl}
                      alt={`${detailName} media ${index + 1}`}
                      className="object-cover"
                      sizes="(max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className='w-1/2'>
            {/* Info sections */}
            {PRODUCT_STATIC_STEPS.length > 0 && (
              <div className="flex flex-col">
                {PRODUCT_STATIC_STEPS.map((section) => (
                  <div key={section.number} className="py-5 space-y-4">
                    <p className="text-[20px] leading-6 text-[#D35565] tobia-normal  tracking-wide  ">{section.number}</p>
                    <h3 className="text-[24px] leading-7  tobia-normal text-[#111111]">{section.title}</h3>
                    <p className="text-[16px]  leading-5 text-[#111111CC] font-normal border-[#25252533] border-b pb-10 ">{section.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Related Products */}
        <RelatedProducts products={related} />

      </div>
    </main>
  )
}