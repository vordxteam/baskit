import VerifyEmailPage from '@/components/auth/VerifyEmailPage'
import { Metadata } from 'next/dist/lib/metadata/types/metadata-interface';
import React, { Suspense } from 'react'

export const metadata: Metadata = {
  title: "Verify Email",
  description: "This is Verify Email Page",
};
  
const page = () => {
  return (
    <Suspense fallback={null}>
      <VerifyEmailPage />
    </Suspense>
  )
}

export default page