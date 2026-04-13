import React from 'react'
import Filters from '../product/Filters'
import BouqetsProducts from './BouqetsProducts'
export default function BouqetsPage() {
  return (
       <div>
      <div className='flex sm:items-start sm:flex-row flex-col gap-8 px-12 py-20 max-w-[1440px] m-auto'>
        <div>
          <Filters />
        </div>
        <div>
         <BouqetsProducts />
        </div>
      </div>
    </div>
  )
}
