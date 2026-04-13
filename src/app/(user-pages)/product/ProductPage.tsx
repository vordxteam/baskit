import React from 'react'
import AllProducts from './Products'
import Filters from './Filters'

const ProductPage = () => {
  return (
    <div>
      <div className='flex sm:items-start sm:flex-row flex-col gap-8 px-12 py-20 max-w-[1440px] m-auto'>
        <div>
          <Filters />
        </div>
        <div>
          <AllProducts />
        </div>
      </div>
    </div>
  )
}

export default ProductPage