"use client"

import type React from "react"
import { useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { StartProjectModal } from "../start-project-modal"

export function VentureBuildingCTA() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })

  const openCalendly = () => {
    // Replace this URL with your actual Calendly link
    const calendlyUrl = "https://calendly.com/tenacity-ventures"
    window.open(calendlyUrl, "_blank")
  }

  return (
    <section ref={containerRef} className="w-full py-20 sm:py-32 md:py-40 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#F7F5F3] via-[#F7F5F3] to-[#37322F]/5 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-8"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-normal text-[#37322F] leading-tight">
            Let's build your
            <br />
            venture together
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-[#605A57] text-lg sm:text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed"
          >
            Whether you're pre-idea or ready to scale, we partner with founders who refuse to build ordinary companies.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
          >
            <motion.button
              onClick={() => setIsModalOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#37322F] text-white px-10 py-5 rounded-full font-medium text-lg hover:bg-[#4a443f] transition-all duration-300 shadow-lg"
            >
              Start building
            </motion.button>
            <motion.button
              onClick={openCalendly}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-[#37322F] text-[#37322F] px-10 py-5 rounded-full font-medium text-lg hover:bg-[#37322F] hover:text-white transition-all duration-300"
            >
              Schedule a call
            </motion.button>
          </motion.div>

          {/* Trust indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="pt-8 border-t border-[rgba(55,50,47,0.12)] mt-12"
          >
            <p className="text-[#605A57] text-sm sm:text-base">
              Join 50+ ventures we've co-built across 8 African countries
            </p>
          </motion.div>
        </motion.div>

        {/* Decorative elements */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -z-10 pointer-events-none"
        >
          <div className="w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] bg-[#37322F]/10 rounded-full blur-3xl" />
        </motion.div>
      </div>

      {/* Start Project Modal */}
      <StartProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultService="Venture Building"
      />
    </section>
  )
}
