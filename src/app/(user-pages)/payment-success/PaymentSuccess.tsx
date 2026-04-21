"use client"
import Link from "next/link";
export default function PaymentSuccess() {
  return (
    <div className="min-h-screen bg-[#F4F1E8] flex items-center justify-center p-8 font-sans">
      <div className="bg-[#F4F1E8] border border-[#DDD8CC] max-w-[480px] w-full px-10 py-12 text-center">

        <div className="flex justify-center gap-2 mb-6">
          <span className="text-[22px]">🌸</span>
          <span className="text-[22px]">🌷</span>
          <span className="text-[22px]">🌼</span>
        </div>

        <div className="w-[72px] h-[72px] rounded-full bg-[#E8F5EE] border border-[#B5D9C5] flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 stroke-[#2D7A52] stroke-2 fill-none" viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h1 className="font-serif text-[26px] font-normal text-[#3A342D] mb-2">
          Payment confirmed!
        </h1>

        <p className="text-[15px] text-[#7B7469] leading-relaxed mb-8">
          Your bouquet is on its way.<br />
          We&apos;ll notify you when it&apos;s been dispatched.
        </p>
         
         <Link href="/">
         <button  className="bg-black text-white py-3 px-3">
            Continue shopping
         </button>
         </Link>
      </div>
    </div>
  );
}