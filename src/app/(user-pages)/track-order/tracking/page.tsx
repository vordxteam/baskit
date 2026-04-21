import { Suspense } from "react";
import TrackingOrderPage from "../TrackingOrderPage";

const Page = () => {
  return (
    <Suspense
      fallback={
        <main className="bg-gray-50 px-6 pb-16 pt-3 text-[#252525] sm:px-10 lg:px-20">
          <div className="mx-auto w-full max-w-[1440px]">
            <div className="mt-12 border border-[#25252526] p-8 text-center">
              <p className="text-[16px] text-[#252525]">Loading order tracking details...</p>
            </div>
          </div>
        </main>
      }
    >
      <TrackingOrderPage />
    </Suspense>
  );
};

export default Page;
