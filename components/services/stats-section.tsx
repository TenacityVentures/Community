"use client"

import type React from "react"
import { useRef, useEffect, useState } from "react"
import { motion, useInView, useMotionValue, useSpring } from "framer-motion"

interface StatProps {
  end: number
  duration?: number
  suffix?: string
  prefix?: string
}

function AnimatedNumber({ end, duration = 2, suffix = "", prefix = "" }: StatProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, { duration: duration * 1000 })

  useEffect(() => {
    if (isInView) {
      motionValue.set(end)
    }
  }, [isInView, end, motionValue])

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      setDisplayValue(Math.floor(latest))
    })
    return unsubscribe
  }, [springValue])

  return (
    <div ref={ref} className="text-5xl sm:text-6xl md:text-7xl font-serif font-normal text-[#37322F]">
      {prefix}
      {displayValue}
      {suffix}
    </div>
  )
}

const stats = [
  { value: 50, suffix: "+", label: "Ventures Built" },
  { value: 100, suffix: "M+", prefix: "$", label: "Capital Raised" },
  { value: 8, suffix: "", label: "Countries" },
  { value: 200, suffix: "+", label: "Founders Supported" },
]

export function StatsSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })

  return (
    <section ref={containerRef} className="w-full py-16 sm:py-24 md:py-32 border-t border-b border-[rgba(55,50,47,0.12)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16 sm:mb-20"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-normal text-[#37322F] mb-4">
            Impact in numbers
          </h2>
          <p className="text-[#605A57] text-lg sm:text-xl max-w-2xl mx-auto">
            Building the future, one venture at a time.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-16">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-center"
            >
              <AnimatedNumber
                end={stat.value}
                suffix={stat.suffix}
                prefix={stat.prefix}
                duration={2.5}
              />
              <p className="text-[#605A57] text-base sm:text-lg mt-3">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
