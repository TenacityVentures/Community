"use client"

import type React from "react"
import { useRef } from "react"
import { motion, useInView, useScroll, useTransform } from "framer-motion"

const approachSteps = [
  {
    number: "01",
    title: "Think",
    description: "Deep dive into your vision, market, and opportunity. We challenge assumptions and build clarity.",
  },
  {
    number: "02",
    title: "Build",
    description: "Execute with precision. From strategy to design to code, we move fast and build right.",
  },
  {
    number: "03",
    title: "Scale",
    description: "Take it to market and beyond. We optimize, iterate, and grow with you.",
  },
  {
    number: "04",
    title: "Evolve",
    description: "Continuous improvement. We adapt to market feedback and scale what works.",
  },
]

export function ApproachSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])

  return (
    <section ref={containerRef} className="w-full py-16 sm:py-24 md:py-32 bg-[#37322F] text-white relative overflow-hidden">
      {/* Background pattern */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 opacity-5 pointer-events-none"
      >
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16 sm:mb-20"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-normal mb-4">
            Our approach
          </h2>
          <p className="text-white/70 text-lg sm:text-xl max-w-2xl mx-auto">
            A proven process refined through building ventures across Africa.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          {approachSteps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="relative group"
            >
              <div className="flex flex-col gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                  className="text-6xl sm:text-7xl font-serif font-normal text-white/20 group-hover:text-white/40 transition-colors duration-300"
                >
                  {step.number}
                </motion.div>

                <h3 className="text-2xl sm:text-3xl font-semibold">
                  {step.title}
                </h3>

                <p className="text-white/70 text-base leading-relaxed">
                  {step.description}
                </p>

                <motion.div
                  initial={{ width: "0%" }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className="h-0.5 bg-white/30"
                />
              </div>

              {/* Connecting line (except for last item on desktop) */}
              {index < approachSteps.length - 1 && (
                <div className="hidden lg:block absolute top-12 -right-4 w-8 h-0.5 bg-white/20" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
