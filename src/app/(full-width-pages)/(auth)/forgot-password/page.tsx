import ForgotPasswordPage from '@/components/auth/ForgotPasswordPage'
import { Metadata } from 'next/dist/lib/metadata/types/metadata-interface';
import React from 'react'

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "This is Next.js",
};

const page = () => {
  return <ForgotPasswordPage />
}

export default page