'use client'

import FooterSection from "@/components/footer-section"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/services/hero-section"
import { ServicesShowcase } from "@/components/services/services-showcase"
import { ApproachSection } from "@/components/services/approach-section"
import { StatsSection } from "@/components/services/stats-section"
import { CTASection as ServicesCTA } from "@/components/services/cta-section"

export default function Services() {
  return (
    <div className="w-full min-h-screen relative bg-[#F7F5F3] overflow-x-hidden flex flex-col justify-start items-center">
      <div className="relative flex flex-col justify-start items-center w-full">
        {/* Main container with proper margins */}
        <div className="w-full max-w-none px-4 sm:px-6 md:px-8 lg:px-0 lg:max-w-[1060px] lg:w-[1060px] relative flex flex-col justify-start items-start min-h-screen">
          {/* Left vertical line */}
          <div className="w-[1px] h-full absolute left-4 sm:left-6 md:left-8 lg:left-0 top-0 bg-[rgba(55,50,47,0.12)] shadow-[1px_0px_0px_white] z-0"></div>

          {/* Right vertical line */}
          <div className="w-[1px] h-full absolute right-4 sm:right-6 md:right-8 lg:right-0 top-0 bg-[rgba(55,50,47,0.12)] shadow-[1px_0px_0px_white] z-0"></div>

          <Header />
          <div className="pt-12 sm:pt-16 md:pt-20 lg:pt-[116px] pb-8 sm:pb-12 md:pb-16 flex flex-col justify-start items-center w-full">
            <HeroSection />
          </div>
        </div>

        {/* Full-width sections */}
        <div className="w-full">
          <ServicesShowcase />
          <ApproachSection />
          <StatsSection />
          <ServicesCTA />

          {/* Footer Section */}
          <div className="w-full max-w-none px-4 sm:px-6 md:px-8 lg:px-0 lg:max-w-[1060px] lg:w-[1060px] mx-auto relative">
            {/* Left vertical line */}
            <div className="w-[1px] h-full absolute left-4 sm:left-6 md:left-8 lg:left-0 top-0 bg-[rgba(55,50,47,0.12)] shadow-[1px_0px_0px_white] z-0"></div>

            {/* Right vertical line */}
            <div className="w-[1px] h-full absolute right-4 sm:right-6 md:right-8 lg:right-0 top-0 bg-[rgba(55,50,47,0.12)] shadow-[1px_0px_0px_white] z-0"></div>

            <FooterSection />
          </div>
        </div>
      </div>
    </div>
  )
}
