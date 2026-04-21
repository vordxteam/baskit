// data/productDetails.ts

export type ProductDetail = {
  id: number
  name: string
  price: string
  description: string
  includes: string[]
  short_description?: string
  image: string
  sections: {
    number: string
    title: string
    content: string
  }[]
}

export const productDetails: ProductDetail[] = [
  {
    id: 1,
    name: 'Truly Luxe Hamper',
    price: 'PKR 5,999',
    image: '/images/truly-luxe-hamper.png',
    description:
      'Draped in elegant ivory jute, the Truly Luxe Hamper is a celebration of abundance, beauty, and love. Thoughtfully designed as the perfect gift for newlyweds, it brings together a selection of artisanal chocolates in our most loved flavors.',
    includes: [
      'Ivory Motif Box (16pc) with chocolate bon bons',
      'Gold leather box (12pc) with classic chocolates',
      'Kaju katli milk chocolate bar',
      'Nan khatai chocolate bar',
      'Ras malai chocolate bar',
      'Milk chocolate almond dragees',
      'Super seed dark chocolate bark',
      'Chocolate almonds',
    ],
    sections: [
      {
        number: '- 01 - ',
        title: 'A note about substitutions',
        content:
          'We handcraft most of our products in small batches and source ingredients from local businesses. As availability may vary, we may substitute an item with one of equal or greater value, ensuring it matches our high quality and design standards.',
      },
      {
        number: '- 02 - ',
        title: 'Greeting cards instructions',
        content:
          'A complimentary greeting card is included with every order. You can choose a blank card or add a custom message (up to 180 characters) by entering it in the greeting card message box at checkout. Your message will also appear in your order confirmation email.',
      },
      {
        number: '- 03 - ',
        title: 'Disclaimer',
        content:
          'Please note that Lals may modify our product packaging slightly based on the availability of raw materials. These changes are made with care to maintain our high standards of quality. Thank you for your continued support.',
      },
    ],
  },
  // ✅ Add more products here as you grow. Same shape, different id.
  // {
  //   id: 2,
  //   name: 'Rose Garden Bouquet',
  //   price: 'PKR 3,999',
  //   image: '/images/products/rose-garden.jpg',
  //   ...
  // }
]