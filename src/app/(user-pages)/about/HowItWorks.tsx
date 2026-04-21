// components/HowItWorks.tsx

const steps = [
  {
    number: "01",
    title: "Choose your Baskit",
    description:
      "Explore our collection and pick the perfect arrangement for any occasion any time.",
  },
  {
    number: "02",
    title: "Place your order",
    description:
      "Place your order and can also add thoughtful personal touches.",
  },
  {
    number: "03",
    title: "We deliver at your doorstep",
    description:
      "Handcrafted with care and delivered fresh, right on schedule within 160 mins every time.",
  },
];

export default function HowItWorks() {
  return (
    <section className="px-20 max-w-[1440px] mx-auto pt-13 w-full">
      {/* Title */}
      <h2 className="font-serif sm:text-[48px] text-[30px] tobia-normal text-[#1a1a1a] mb-10 tracking-tight leading-13">
        How it works
      </h2>



      {/* Steps grid */}
      <div className="grid sm:grid-cols-2 grid-cols-1 md:grid-cols-3 gap-5">
        {steps.map((step, index) => (
          <div
            key={step.number}
            className={`px-6 pt-5 pb-6 ${
              index !== 0 ? "border-l-0" : ""
            }`}
          >
            {/* Step number */}
            <p className="text-[#D35565] tobia-normal text-[20px] leading-6 tracking-wide mb-4">
              - {step.number} -
            </p>

            {/* Step title */}
            <h3 className="tobia-normal text-[24px] leading-7 text-[#252525] mb-4">
              {step.title}
            </h3>

            {/* Step description */}
            <p className="font-normal text-[16px] leading-5 text-[#252525CC]">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}