import { Van , Heart, Leaf, Gift,  Flower, Headset } from 'lucide-react'

const promises = [
  {
    icon: Van,
    title: 'Fast when it matters',
    description: 'Same day delivery within hours, so you never miss a moment.',
  },
  {
    icon: Heart,
    title: 'Personal by design',
    description: 'Every basket can be customized to match the person, not just the occasion.',
  },
  {
    icon: Leaf,
    title: 'Premium in every detail',
    description: 'From product selection to packaging, everything is crafted to impress.',
  },
  {
    icon: Gift,
    title: 'Thoughtful packaging',
    description: 'Every order is carefully packed to ensure a beautiful unboxing experience.',
  },
  {
    icon:  Flower,
    title: 'Freshness guaranteed',
    description: 'We use fresh flowers and quality items to ensure every gift feels perfect.',
  },
  {
    icon: Headset,
    title: '24/7 customer support',
    description: 'Our team is always here to assist you with orders, customization, and delivery.',
  },
]

export default function OurPromise() {
  return (
    <section className="w-full max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-20 py-13">

      {/* Heading */}
      <h2 className="text-[36px] sm:text-[48px] leading-10 sm:leading-13 tobia-normal text-[#252525] mb-13">
        Our promise
      </h2>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {promises.map((item) => {
          const Icon = item.icon
          return (
            <div
              key={item.title}
              className="flex flex-col items-center text-center py-6 px-5"
            >
              <Icon
                size={28}
                strokeWidth={1.5}
                className="text-[#252525] mb-5"
              />
              <h3 className="tobia-normal text-[24px] text-[#252525] leading-7 mb-4">
                {item.title}
              </h3>
              <p className="text-[16px] font-normal leading-5 text-[#252525CC] max-w-[360px]">
                {item.description}
              </p>
            </div>
          )
        })}
      </div>

    </section>
  )
}