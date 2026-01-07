"use client"

import type React from "react"
import { useRef } from "react"
import { motion, useInView } from "framer-motion"

export function CaseStudySection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })

  return (
    <section ref={containerRef} className="w-full py-16 sm:py-24 md:py-32 border-t border-[rgba(55,50,47,0.12)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-normal text-[#37322F] mb-4">
            Ventures we've built
          </h2>
          <p className="text-[#605A57] text-lg sm:text-xl max-w-2xl mx-auto">
            Real stories from founders who refused to settle.
          </p>
        </motion.div>

        {/* Featured Case Study */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white border border-[rgba(55,50,47,0.12)] rounded-2xl overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Content */}
            <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
              <div className="mb-6">
                <span className="text-[#605A57] text-sm font-medium uppercase tracking-wider">
                  Case Study
                </span>
              </div>

              <h3 className="text-3xl sm:text-4xl md:text-5xl font-serif font-normal text-[#37322F] mb-6">
                From idea to 50K users in 6 months
              </h3>

              <p className="text-[#605A57] text-lg sm:text-xl leading-relaxed mb-8">
                A fintech startup in West Africa needed more than just tech—they needed a complete venture build. We partnered to validate the market, build the product, launch the brand, and scale to market leadership.
              </p>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div>
                  <div className="text-3xl sm:text-4xl font-serif text-[#37322F] mb-1">50K+</div>
                  <div className="text-sm text-[#605A57]">Active Users</div>
                </div>
                <div>
                  <div className="text-3xl sm:text-4xl font-serif text-[#37322F] mb-1">$2M</div>
                  <div className="text-sm text-[#605A57]">Raised</div>
                </div>
                <div>
                  <div className="text-3xl sm:text-4xl font-serif text-[#37322F] mb-1">6mo</div>
                  <div className="text-sm text-[#605A57]">To Launch</div>
                </div>
              </div>

              {/* What we did */}
              <div className="space-y-3">
                <div className="text-sm font-semibold text-[#37322F] uppercase tracking-wider mb-3">
                  What we delivered
                </div>
                {[
                  "Market validation & business model",
                  "Full product design & development",
                  "Brand identity & launch campaign",
                  "Growth strategy & early traction",
                ].map((item, idx) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -10 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                    transition={{ duration: 0.4, delay: 0.3 + idx * 0.1 }}
                    className="flex items-center gap-2 text-[#605A57]"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[#37322F]" />
                    <span>{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Visual/Image placeholder */}
            <div className="bg-gradient-to-br from-[#37322F] to-[#4a443f] p-8 sm:p-12 lg:p-16 flex items-center justify-center min-h-[400px] lg:min-h-full">
              <div className="text-center">
                <div className="text-white/20 text-8xl sm:text-9xl font-serif mb-4">∞</div>
                <p className="text-white/60 text-sm sm:text-base max-w-xs">
                  Building ventures that create lasting impact across Africa
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Additional ventures teaser */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 sm:mt-16 text-center"
        >
          <p className="text-[#605A57] text-base sm:text-lg mb-4">
            We've co-built ventures across fintech, healthtech, edtech, and commerce.
          </p>
          <button className="text-[#37322F] font-medium hover:underline">
            See more case studies →
          </button>
        </motion.div>
      </div>
    </section>
  )
}
