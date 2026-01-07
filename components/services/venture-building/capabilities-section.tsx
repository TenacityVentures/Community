"use client"

import type React from "react"
import { useState, useRef } from "react"
import { motion, useInView } from "framer-motion"

interface Capability {
  category: string
  items: string[]
}

const capabilities: Capability[] = [
  {
    category: "Strategy & Validation",
    items: [
      "Market research & analysis",
      "Business model design",
      "Competitive intelligence",
      "Product-market fit validation",
      "Financial modeling",
      "Pitch deck development",
    ],
  },
  {
    category: "Product & Technology",
    items: [
      "Product strategy & roadmap",
      "UX/UI design & prototyping",
      "Full-stack development",
      "AI automation & integration",
      "Cloud infrastructure setup",
      "API development",
    ],
  },
  {
    category: "Brand & Marketing",
    items: [
      "Brand identity & positioning",
      "Content strategy",
      "Digital brand transformation",
      "Social media presence",
      "Launch campaigns",
      "Storytelling & narrative",
    ],
  },
  {
    category: "Growth & Operations",
    items: [
      "Go-to-market strategy",
      "Performance marketing",
      "WhatsApp Business automation",
      "Sales process design",
      "Analytics & optimization",
      "Team assembly & hiring",
    ],
  },
]

export function CapabilitiesSection() {
  const [activeCategory, setActiveCategory] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })

  return (
    <section ref={containerRef} className="w-full py-16 sm:py-24 md:py-32 bg-[#37322F] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16 sm:mb-20"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-normal mb-4">
            What you get
          </h2>
          <p className="text-white/70 text-lg sm:text-xl max-w-2xl mx-auto">
            End-to-end capabilities to take your venture from idea to market leader.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {capabilities.map((capability, index) => (
            <motion.div
              key={capability.category}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              onMouseEnter={() => setActiveCategory(index)}
              onMouseLeave={() => setActiveCategory(null)}
              className="group relative"
            >
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 sm:p-10 transition-all duration-500 hover:bg-white/10 hover:border-white/20">
                <h3 className="text-2xl sm:text-3xl font-semibold mb-6">
                  {capability.category}
                </h3>

                <div className="space-y-3">
                  {capability.items.map((item, itemIndex) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, x: -10 }}
                      animate={
                        isInView && activeCategory === index
                          ? { opacity: 1, x: 0 }
                          : activeCategory === index
                          ? { opacity: 1, x: 0 }
                          : { opacity: 0.7, x: 0 }
                      }
                      transition={{ duration: 0.3, delay: itemIndex * 0.05 }}
                      className="flex items-center gap-3 text-base text-white/80"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
                      <span>{item}</span>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: activeCategory === index ? "100%" : "0%" }}
                  transition={{ duration: 0.4 }}
                  className="absolute bottom-0 left-0 h-1 bg-white/40 rounded-b-2xl"
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mt-12 sm:mt-16"
        >
          <p className="text-white/60 text-sm sm:text-base max-w-3xl mx-auto">
            Every venture is unique. We adapt our approach to your specific needs, market, and ambitions.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
