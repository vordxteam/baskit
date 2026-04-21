'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    question: 'How do I track my order?',
    answer:
      'Once your order is confirmed, you will receive an email with a tracking link. You can use this link to monitor your delivery status in real time. If you face any issues, our support team is available 24/7 to assist you.',
  },
  {
    question: 'How long does shipping take?',
    answer:
      'We offer same-day delivery within Lahore for orders placed before 2 PM. For other cities, delivery typically takes 2–4 business days. You will be notified of your estimated delivery date at checkout.',
  },
  {
    question: 'How can I update my payment information?',
    answer:
      'You can update your payment information by logging into your account and navigating to the billing section. If you checked out as a guest, please contact our support team and we will assist you promptly.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit and debit cards, bank transfers, and cash on delivery within Lahore. All online transactions are secured and encrypted for your safety.',
  },
  {
    question: 'Can I customize my baskit?',
    answer:
      'Absolutely! Every baskit can be fully customized — from the size and fillers to the ribbon color and a personal greeting card message. Simply select your preferences on the product page before adding to your cart.',
  },
]

function FAQItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div className="border-t border-[#2525251F]">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between py-6 text-left gap-6 group"
      >
        <span className="text-[20px] font-normal leading-6 text-[#25252599]  transition-colors duration-200">
          {question}
        </span>
        <ChevronDown
          size={18}
          strokeWidth={1.5}
          className={`shrink-0 text-[#25252599] transition-transform duration-700 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[400px] pb-6' : 'max-h-0'
        }`}
      >
        <p className="text-[15px] font-light leading-7 text-[#252525CC] max-w-[860px]">
          {answer}
        </p>
      </div>
    </div>
  )
}

export default function HelpFaqs() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index))
  }

  return (
    <section className="w-full py-16">
      <div className="max-w-[1040px] mx-auto px-5 sm:px-10">

        {/* Heading */}
        <h2 className="text-[28px] leading-8 tobia-normal text-[#252525]  mb-15">
          Frequently asked questions
        </h2>

        {/* FAQ Items */}
        <div>
          {faqs.map((faq, index) => (
            <FAQItem
              key={faq.question}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onToggle={() => toggle(index)}
            />
          ))}
          {/* Bottom border */}
          <div className="border-t border-[#25252514]" />
        </div>

      </div>
    </section>
  )
}