"use client"
import Link from "next/link"

export default function PaymentFailed() {
  return (
    <div className="min-h-screen bg-[#F4F1E8] flex items-center justify-center p-8 font-sans">
      <div className="bg-[#F4F1E8] border border-[#DDD8CC] max-w-[480px] w-full px-10 py-12 text-center">

        {/* Wilted icons */}
        <div className="flex justify-center gap-2 mb-6 grayscale-[0.4]">
          <span className="text-[22px]">🥀</span>
          <span className="text-[22px]">🥀</span>
          <span className="text-[22px]">🥀</span>
        </div>

        {/* Error icon */}
        <div className="w-[72px] h-[72px] rounded-full bg-[#FAEAEA] border border-[#F0BABA] flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 stroke-[#B03030] stroke-2 fill-none" viewBox="0 0 24 24">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </div>

        <h1 className="font-serif text-[26px] font-normal text-[#3A342D] mb-2">
          Payment failed
        </h1>

        <p className="text-[15px] text-[#7B7469] leading-relaxed mb-6">
          We couldn&apos;t process your payment.<br />
          Your order has not been placed.
        </p>

        {/* Reason box */}
        <div className="bg-[#FAEAEA] border border-[#F0BABA] text-left p-4 mb-6">
          <p className="text-sm text-[#B03030] font-medium mb-1">Reason</p>
          <p className="text-sm text-[#7B7469]">
            Your card was declined by the issuing bank. No amount has been charged.
          </p>
        </div>

        {/* Tips */}
        <div className="text-left mb-6">
          <p className="text-[13px] text-[#958E82] mb-2 uppercase tracking-wide">
            What to try
          </p>

          {[
            "Check that your card details are entered correctly.",
            "Ensure sufficient balance or credit limit.",
            "Try a different payment method or card.",
            "Contact your bank if the issue persists.",
          ].map((tip, i) => (
            <div key={i} className="flex items-start gap-2 mb-2">
              <div className="w-1.5 h-1.5 mt-2 rounded-full bg-[#B03030]" />
              <p className="text-sm text-[#7B7469]">{tip}</p>
            </div>
          ))}
        </div>
        <Link href="/">
        <button className="bg-black px-3 py-3 text-white mt-3 hover-opacity-70">
            Back to Home
        </button>
        </Link>
      </div>
    </div>
  );
}