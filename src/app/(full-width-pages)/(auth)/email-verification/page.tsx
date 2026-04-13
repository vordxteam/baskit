import VerifyingPage from '@/components/auth/VerifyingPage'
import { Metadata } from 'next';
import React from 'react'


export const metadata: Metadata = {
  title: "Email Verification",
  description: "This is Email Verification Page",
};

const page = () => {
  return <VerifyingPage />
}

export default page