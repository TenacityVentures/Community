"use client"

import { motion } from "framer-motion"
import { useState } from "react"

function Badge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="px-[14px] py-[6px] bg-white shadow-[0px_0px_0px_4px_rgba(55,50,47,0.05)] overflow-hidden rounded-[90px] flex justify-start items-center gap-[8px] border border-[rgba(2,6,23,0.08)] shadow-xs">
      <div className="w-[14px] h-[14px] relative overflow-hidden flex items-center justify-center">{icon}</div>
      <div className="text-center flex justify-center flex-col text-[#37322F] text-xs font-medium leading-3 font-sans">
        {text}
      </div>
    </div>
  )
}

interface OpportunityCardProps {
  title: string
  description: string
  icon: React.ReactNode
  ctaText: string
}

function OpportunityCard({ title, description, icon, ctaText }: OpportunityCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="bg-white border border-[#E0DEDB] rounded-xl p-6 sm:p-8 flex flex-col gap-4 hover:shadow-[0px_4px_12px_rgba(55,50,47,0.08)] transition-shadow duration-300"
    >
      <div className="w-12 h-12 rounded-full bg-[#37322F]/5 flex items-center justify-center">
        {icon}
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-[#37322F] text-xl sm:text-2xl font-semibold leading-tight font-sans">
          {title}
        </h3>
        <p className="text-[#605A57] text-sm sm:text-base font-normal leading-relaxed font-sans">
          {description}
        </p>
      </div>

      <motion.button
        whileHover={{ x: 4 }}
        transition={{ duration: 0.2 }}
        className="text-[#37322F] text-sm font-semibold hover:text-[#605A57] flex items-center gap-2 mt-2 self-start"
      >
        {ctaText}
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.button>
    </motion.div>
  )
}

export function VentureOpportunities() {
  return (
    <div className="w-full border-b border-[rgba(55,50,47,0.12)] flex flex-col justify-center items-center">
      {/* Header Section */}
      <div className="self-stretch px-4 sm:px-6 md:px-8 lg:px-0 py-8 sm:py-12 md:py-16 border-b border-[rgba(55,50,47,0.12)] flex justify-center items-center gap-6">
        <div className="w-full max-w-[616px] lg:w-[616px] px-4 sm:px-6 py-4 sm:py-5 overflow-hidden rounded-lg flex flex-col justify-start items-center gap-3 sm:gap-4">
          <Badge
            icon={
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="7" cy="7" r="5" stroke="#37322F" strokeWidth="1" fill="none"/>
                <circle cx="7" cy="7" r="1.5" fill="#37322F"/>
              </svg>
            }
            text="Get Involved"
          />
          <div className="w-full text-center flex justify-center flex-col text-[#49423D] text-xl sm:text-2xl md:text-3xl lg:text-5xl font-semibold leading-tight md:leading-[60px] font-sans tracking-tight">
            Join Us in Building the Future
          </div>
          <div className="self-stretch text-center text-[#605A57] text-sm sm:text-base font-normal leading-6 sm:leading-7 font-sans">
            Whether you're a founder with an idea, a builder looking to create, or an investor seeking impact — there's a place for you at Tenacity.
          </div>
        </div>
      </div>

      {/* Opportunities Grid */}
      <div className="self-stretch flex justify-center items-start">
        <div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch relative overflow-hidden">
          {/* Left decorative pattern */}
          <div className="w-[120px] sm:w-[140px] md:w-[162px] left-[-40px] sm:left-[-50px] md:left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className="self-stretch h-3 sm:h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"
              />
            ))}
          </div>
        </div>

        <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 grid grid-cols-1 md:grid-cols-3 gap-6 border-l border-r border-[rgba(55,50,47,0.12)]">
          <OpportunityCard
            title="Pitch Your Idea"
            description="Have a bold vision for solving African challenges? We provide the resources, expertise, and network to bring your idea to life."
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L15 8.5L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L9 8.5L12 2Z" stroke="#37322F" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
              </svg>
            }
            ctaText="Submit your pitch"
          />

          <OpportunityCard
            title="Build With Us"
            description="Join an existing venture as a co-founder, early team member, or contributor. Work alongside passionate builders creating real impact."
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="7" height="7" stroke="#37322F" strokeWidth="1.5" fill="none"/>
                <rect x="14" y="3" width="7" height="7" stroke="#37322F" strokeWidth="1.5" fill="none"/>
                <rect x="3" y="14" width="7" height="7" stroke="#37322F" strokeWidth="1.5" fill="none"/>
                <rect x="14" y="14" width="7" height="7" stroke="#37322F" strokeWidth="1.5" fill="none"/>
              </svg>
            }
            ctaText="Explore opportunities"
          />

          <OpportunityCard
            title="Partner With Us"
            description="Organizations and investors who share our vision can partner with us to accelerate venture growth and amplify impact."
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="9" cy="7" r="4" stroke="#37322F" strokeWidth="1.5" fill="none"/>
                <circle cx="17" cy="17" r="4" stroke="#37322F" strokeWidth="1.5" fill="none"/>
                <path d="M12 10L14 14" stroke="#37322F" strokeWidth="1.5"/>
              </svg>
            }
            ctaText="Learn about partnerships"
          />
        </div>

        <div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch relative overflow-hidden">
          {/* Right decorative pattern */}
          <div className="w-[120px] sm:w-[140px] md:w-[162px] left-[-40px] sm:left-[-50px] md:left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className="self-stretch h-3 sm:h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
