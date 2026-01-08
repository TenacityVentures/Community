"use client"

import { motion } from "framer-motion"
import { useState } from "react"

interface Venture {
  id: number
  name: string
  description: string
  category: string
  status: "Active" | "Launching" | "In Development"
  impact: string
}

const ventures: Venture[] = [
  {
    id: 1,
    name: "Horizon",
    description: "Building the future of African commerce through innovative digital infrastructure and seamless payment solutions.",
    category: "Fintech",
    status: "Active",
    impact: "10K+ users"
  },
  {
    id: 2,
    name: "Catalyst",
    description: "Empowering the next generation of African entrepreneurs through mentorship, resources, and community.",
    category: "Education",
    status: "Active",
    impact: "500+ founders"
  },
  {
    id: 3,
    name: "Bridge",
    description: "Connecting African talent with global opportunities through skills development and job matching.",
    category: "HR Tech",
    status: "Launching",
    impact: "Coming soon"
  },
  {
    id: 4,
    name: "Pulse",
    description: "Real-time market intelligence and data analytics for African businesses making critical decisions.",
    category: "Data & Analytics",
    status: "In Development",
    impact: "Beta access"
  }
]

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

export function VenturesShowcase() {
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  return (
    <div className="w-full border-b border-[rgba(55,50,47,0.12)] flex flex-col justify-center items-center">
      {/* Header Section */}
      <div className="self-stretch px-4 sm:px-6 md:px-8 lg:px-0 py-8 sm:py-12 md:py-16 border-b border-[rgba(55,50,47,0.12)] flex justify-center items-center gap-6">
        <div className="w-full max-w-[616px] lg:w-[616px] px-4 sm:px-6 py-4 sm:py-5 overflow-hidden rounded-lg flex flex-col justify-start items-center gap-3 sm:gap-4">
          <Badge
            icon={
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="2" width="4" height="4" stroke="#37322F" strokeWidth="1" fill="none" />
                <rect x="8" y="2" width="4" height="4" stroke="#37322F" strokeWidth="1" fill="none" />
                <rect x="2" y="8" width="4" height="4" stroke="#37322F" strokeWidth="1" fill="none" />
                <rect x="8" y="8" width="4" height="4" stroke="#37322F" strokeWidth="1" fill="none" />
              </svg>
            }
            text="Our Ventures"
          />
          <div className="w-full text-center flex justify-center flex-col text-[#49423D] text-xl sm:text-2xl md:text-3xl lg:text-5xl font-semibold leading-tight md:leading-[60px] font-sans tracking-tight">
            Building the Future of Africa, One Venture at a Time
          </div>
          <div className="self-stretch text-center text-[#605A57] text-sm sm:text-base font-normal leading-6 sm:leading-7 font-sans">
            Each venture is born from deep market insight, built with world-class execution, and driven by unwavering commitment to impact.
          </div>
        </div>
      </div>

      {/* Ventures Grid */}
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

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-0 border-l border-r border-[rgba(55,50,47,0.12)]">
          {ventures.map((venture, index) => {
            const isLastRow = index >= ventures.length - 2
            const isRightColumn = index % 2 === 1

            return (
              <motion.div
                key={venture.id}
                onMouseEnter={() => setHoveredId(venture.id)}
                onMouseLeave={() => setHoveredId(null)}
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
                className={`
                  border-b border-[rgba(55,50,47,0.12)] p-6 sm:p-8 lg:p-10 flex flex-col justify-start items-start gap-4
                  ${!isRightColumn ? 'md:border-r' : ''}
                  ${isLastRow ? 'border-b-0' : ''}
                  bg-white hover:bg-[#F7F5F3]/50 transition-colors duration-300
                `}
              >
                <div className="flex justify-between items-start w-full">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-[#37322F] text-xl sm:text-2xl font-semibold leading-tight font-sans">
                      {venture.name}
                    </h3>
                    <span className="text-[#605A57] text-xs font-medium uppercase tracking-wide">
                      {venture.category}
                    </span>
                  </div>
                  <div className={`
                    px-3 py-1 rounded-full text-xs font-medium
                    ${venture.status === 'Active' ? 'bg-green-100 text-green-700' : ''}
                    ${venture.status === 'Launching' ? 'bg-blue-100 text-blue-700' : ''}
                    ${venture.status === 'In Development' ? 'bg-amber-100 text-amber-700' : ''}
                  `}>
                    {venture.status}
                  </div>
                </div>

                <p className="text-[#605A57] text-sm sm:text-base font-normal leading-relaxed font-sans">
                  {venture.description}
                </p>

                <div className="flex justify-between items-center w-full mt-2">
                  <span className="text-[#37322F] text-sm font-semibold">
                    {venture.impact}
                  </span>
                  <motion.button
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                    className="text-[#37322F] text-sm font-medium hover:text-[#605A57] flex items-center gap-1"
                  >
                    Learn more
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </motion.button>
                </div>
              </motion.div>
            )
          })}
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
