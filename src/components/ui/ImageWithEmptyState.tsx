'use client'

import { useState } from 'react'
import Image from 'next/image'

type ImageWithEmptyStateProps = {
  src?: string | null
  alt: string
  className?: string
  priority?: boolean
  sizes?: string
}

const ImageWithEmptyState = ({
  src,
  alt,
  className,
  priority = false,
  sizes,
}: ImageWithEmptyStateProps) => {
  const [hasError, setHasError] = useState(false)
  
  if (!src || hasError) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-[#F5F1E8] text-center px-6">
        <p className="text-[14px] sm:text-[16px] text-[#25252599]">
          Image preview not available
        </p>
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      unoptimized
      className={className ?? 'object-cover'}
      priority={priority}
      sizes={sizes}
      onError={() => setHasError(true)}
    />
  )
}

export default ImageWithEmptyState