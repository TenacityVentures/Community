"use client"

import type React from "react"
import { useRef, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { StartProjectModal } from "../start-project-modal"

export function VentureBuildingHero() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95])

  return (
    <motion.section
      ref={containerRef}
      style={{ opacity, scale }}
      className="relative pb-16 sm:pb-24 flex flex-col justify-center items-center w-full pt-8 sm:pt-12 md:pt-16"
    >
      <div className="text-center max-w-4xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6"
        >
          <span className="text-[#605A57] text-sm sm:text-base font-medium uppercase tracking-wider">
            Venture Building
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-normal text-[#37322F] leading-[1.1] mb-6 sm:mb-8">
            From zero to
            <br />
            <motion.span
              className="inline-block"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              market dominance
            </motion.span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="text-[#605A57] text-lg sm:text-xl md:text-2xl mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          We don't just consult. We co-build ventures with founders who think beyond borders and refuse to settle for ordinary.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#37322F] text-white px-8 py-4 rounded-full font-medium text-base hover:bg-[#4a443f] transition-all duration-300 hover:scale-105"
          >
            Build with us
          </button>
        </motion.div>
      </div>

      {/* Decorative element */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -z-10 pointer-events-none"
      >
        <div className="w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] md:w-[800px] md:h-[800px] bg-[#37322F]/5 rounded-full blur-3xl" />
      </motion.div>

      {/* Start Project Modal */}
      <StartProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultService="Venture Building"
      />
    </motion.section>
  )
}
