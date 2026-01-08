"use client"

import type React from "react"
import { useState, useRef } from "react"
import { motion, useInView } from "framer-motion"

interface Service {
  title: string
  description: string
  features: string[]
  icon: React.ReactNode
}

const services: Service[] = [
  {
    title: "Venture Building",
    description: "From zero to market. We co-build ventures with founders who think beyond borders.",
    features: ["Product Strategy", "Go-to-Market", "Team Assembly", "Capital Strategy"],
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="12" width="8" height="14" stroke="currentColor" strokeWidth="2" fill="none" />
        <rect x="18" y="6" width="8" height="20" stroke="currentColor" strokeWidth="2" fill="none" />
      </svg>
    ),
  },
  {
    title: "Brand & Narrative",
    description: "Stories that move markets. Build a brand that people believe in and talk about.",
    features: ["Brand Identity", "Content Strategy", "Visual Design", "Messaging"],
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M11 16 L14 19 L21 12" stroke="currentColor" strokeWidth="2" fill="none" />
      </svg>
    ),
  },
  {
    title: "Product & Engineering",
    description: "Technology that scales. Build products that users love and that grow with your vision.",
    features: ["Product Design", "Engineering", "Infrastructure", "Technical Strategy"],
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="8" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" />
        <line x1="8" y1="14" x2="24" y2="14" stroke="currentColor" strokeWidth="2" />
        <line x1="14" y1="8" x2="14" y2="24" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
  {
    title: "Growth & Scale",
    description: "From traction to dominance. Scale with strategies that work in emerging markets.",
    features: ["Growth Strategy", "Performance Marketing", "Analytics", "Optimization"],
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polyline points="6,24 12,18 18,20 26,8" stroke="currentColor" strokeWidth="2" fill="none" />
        <polyline points="20,8 26,8 26,14" stroke="currentColor" strokeWidth="2" fill="none" />
      </svg>
    ),
  },
]

export function ServicesShowcase() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })

  return (
    <section ref={containerRef} className="w-full py-16 sm:py-24 md:py-32 border-t border-[rgba(55,50,47,0.12)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16 sm:mb-20"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-normal text-[#37322F] mb-4">
            What we do
          </h2>
          <p className="text-[#605A57] text-lg sm:text-xl max-w-2xl mx-auto">
            Services built for founders who refuse to settle.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group relative"
            >
              <div className="bg-white border border-[rgba(55,50,47,0.12)] rounded-2xl p-8 sm:p-10 transition-all duration-500 hover:border-[#37322F] hover:shadow-lg">
                <motion.div
                  animate={{
                    scale: hoveredIndex === index ? 1.1 : 1,
                    rotate: hoveredIndex === index ? 5 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="text-[#37322F] mb-6"
                >
                  {service.icon}
                </motion.div>

                <h3 className="text-2xl sm:text-3xl font-semibold text-[#37322F] mb-3">
                  {service.title}
                </h3>

                <p className="text-[#605A57] text-base sm:text-lg mb-6 leading-relaxed">
                  {service.description}
                </p>

                <div className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <motion.div
                      key={feature}
                      initial={{ opacity: 0, x: -10 }}
                      animate={
                        isInView && hoveredIndex === index
                          ? { opacity: 1, x: 0 }
                          : hoveredIndex === index
                          ? { opacity: 1, x: 0 }
                          : { opacity: 0.6, x: 0 }
                      }
                      transition={{ duration: 0.3, delay: featureIndex * 0.05 }}
                      className="flex items-center gap-2 text-sm text-[#605A57]"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-[#37322F]" />
                      <span>{feature}</span>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: hoveredIndex === index ? "100%" : "0%" }}
                  transition={{ duration: 0.4 }}
                  className="absolute bottom-0 left-0 h-1 bg-[#37322F] rounded-b-2xl"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
