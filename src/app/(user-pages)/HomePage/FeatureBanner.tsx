import Button from "@/components/ui/button/Button";
import React from "react";

const FeatureBanner = () => {
    return (
        <section className="relative w-full h-[520px] md:h-[600px] lg:h-[700px] overflow-hidden">

            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: "url('/images/feature-banner.png')",
                }}
            />

            {/* Optional Overlay (for better text readability) */}
            <div className="absolute inset-0 bg-black/10" />

            {/* Content */}
            <div className="relative z-10 flex h-full max-w-[1440px] mx-auto">
                <div className="px-6 sm:px-10 md:px-14 lg:px-20 py-10 max-w-[732px]">

                    {/* Tagline */}
                    <p className="text-[20px] sm:text-[24px] leading-6 sm:leading-7 uppercase text-[#252525]">
                        — Instant Delivery —
                    </p>

                    {/* Heading */}
                    <h2 className="font-serif text-[32px] sm:text-[48px] text-[#252525] leading-12 sm:leading-14 tobia-normal mt-5 mb-15">
                        Get Your Baskit delivered today, fresh, thoughtfully curated,
                        and right on time
                    </h2>

                    {/* CTA */}
                    <Button variant="primary">
                        Order your Baskit
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default FeatureBanner;