import Button from "@/components/ui/button/Button";
import React from "react";

const HeroSection = () => {
  return (
    <section className="relative isolate w-full overflow-hidden bg-cover bg-center bg-no-repeat bg-[url('/images/bouqetshero.png')] p-10">

      {/* Content */}
      <div
        className="relative max-w-[800px] backdrop-blur-[10px] min-h-[451px] z-10 mx-auto flex items-center justify-center px-5 py-16 text-center sm:px-8 sm:py-10"
        style={{
          background:
            "linear-gradient(90deg, rgba(255, 255, 255, 0.00) 22.13%, rgba(255, 255, 255, 0.06) 52.17%, rgba(255, 255, 255, 0.00) 82.4%)",
        }}
      >
        <div>
          <p className="mb-3 text-[16px] font-light uppercase">
            - Customize Your Order -
          </p>

          <h1 className="text-[#252525] tobia-normal leading-[52px] text-[44px] mb-15">
            Want something truly personal?
Customize your gift hamper your way.
          </h1>

          <Button variant="primary">
            Get a quote
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;