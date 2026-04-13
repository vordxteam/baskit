import ChangePasswordPage from '@/components/auth/ChangePasswordPage'
import { Metadata } from 'next/dist/lib/metadata/types/metadata-interface';
import React, { Suspense } from 'react'

export const metadata: Metadata = {
  title: "Change Password",
  description: "This is Change Password Page",
};
    
const page = () => {
  return (
    <Suspense fallback={null}>
      <ChangePasswordPage />
    </Suspense>
  )
}

export default page