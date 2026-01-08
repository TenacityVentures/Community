"use client"

import type React from "react"
import { useRef } from "react"
import { motion, useInView } from "framer-motion"

const processSteps = [
  {
    number: "01",
    title: "Discovery & Validation",
    description: "We dive deep into your vision, validate market opportunity, and challenge every assumption. No bullshit, just brutal honesty about what works.",
    deliverables: ["Market research", "Competitive analysis", "Business model design", "Validation strategy"],
  },
  {
    number: "02",
    title: "Strategy & Design",
    description: "Build the foundation: product strategy, brand positioning, go-to-market plan. We design experiences users love and strategies that scale.",
    deliverables: ["Product roadmap", "Brand identity", "UX/UI design", "GTM strategy"],
  },
  {
    number: "03",
    title: "Build & Launch",
    description: "From code to customers. We build fast, test relentlessly, and launch with precision. Your MVP isn't just viable—it's irresistible.",
    deliverables: ["Product development", "Infrastructure setup", "Launch campaign", "Early user acquisition"],
  },
  {
    number: "04",
    title: "Scale & Optimize",
    description: "Take it to market and dominate. We optimize every metric, scale what works, and kill what doesn't. Growth isn't a goal—it's a system.",
    deliverables: ["Performance marketing", "Growth experiments", "Team scaling", "Capital strategy"],
  },
]

export function ProcessSection() {
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
            How we build ventures
          </h2>
          <p className="text-[#605A57] text-lg sm:text-xl max-w-2xl mx-auto">
            A battle-tested process refined through building across emerging markets.
          </p>
        </motion.div>

        <div className="space-y-16 sm:space-y-20">
          {processSteps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12"
            >
              {/* Number */}
              <div className="lg:col-span-2">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                  className="text-6xl sm:text-7xl md:text-8xl font-serif font-normal text-[#37322F]/20"
                >
                  {step.number}
                </motion.div>
              </div>

              {/* Content */}
              <div className="lg:col-span-10 space-y-4">
                <div>
                  <h3 className="text-3xl sm:text-4xl font-semibold text-[#37322F] mb-3">
                    {step.title}
                  </h3>
                  <p className="text-[#605A57] text-lg sm:text-xl leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Deliverables */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
                  {step.deliverables.map((deliverable, idx) => (
                    <motion.div
                      key={deliverable}
                      initial={{ opacity: 0, x: -10 }}
                      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                      transition={{ duration: 0.4, delay: index * 0.15 + idx * 0.05 }}
                      className="flex items-center gap-2 text-sm text-[#605A57]"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-[#37322F]" />
                      <span>{deliverable}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Divider line */}
                {index < processSteps.length - 1 && (
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={isInView ? { width: "100%" } : { width: "0%" }}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                    className="h-px bg-[rgba(55,50,47,0.12)] mt-8"
                  />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
