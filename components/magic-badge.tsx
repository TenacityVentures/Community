'use client'

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import type React from "react"

// Six sparkle particles that fan out from the badge center on entry
const SPARKLES = [
  { angle: 0,   dist: 30 },
  { angle: 60,  dist: 26 },
  { angle: 120, dist: 30 },
  { angle: 180, dist: 26 },
  { angle: 240, dist: 30 },
  { angle: 300, dist: 26 },
]

function Particle({ angle, dist, delay }: { angle: number; dist: number; delay: number }) {
  const rad = (angle * Math.PI) / 180
  return (
    <motion.span
      className="absolute rounded-full bg-[#37322f] pointer-events-none"
      style={{ width: 3, height: 3, top: '50%', left: '50%', marginTop: -1.5, marginLeft: -1.5 }}
      initial={{ opacity: 0.85, scale: 1, x: 0, y: 0 }}
      animate={{ opacity: 0, scale: 0, x: Math.cos(rad) * dist, y: Math.sin(rad) * dist }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    />
  )
}

export function MagicBadge({ icon, text }: { icon: React.ReactNode; text: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-20px' })

  return (
    // Block wrapper so callers can center with text-center or flex; the badge itself is inline
    <div ref={ref} className="flex justify-center">
      <div className="relative">
        {/* Sparkle burst */}
        {isInView && SPARKLES.map((s, i) => (
          <Particle key={s.angle} angle={s.angle} dist={s.dist} delay={i * 0.04} />
        ))}

        {/* Badge pill */}
        <motion.div
          className="relative inline-flex items-center gap-[8px] px-[14px] py-[6px] bg-white rounded-[90px] border border-[rgba(2,6,23,0.08)] shadow-[0px_0px_0px_4px_rgba(55,50,47,0.05)] overflow-hidden"
          initial={{ scale: 0.35, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ type: 'spring', stiffness: 480, damping: 20 }}
        >
          {/* Shimmer sweep — slides left to right after the pop */}
          {isInView && (
            <motion.div
              className="absolute inset-0 pointer-events-none z-10"
              style={{
                background: 'linear-gradient(105deg, transparent 25%, rgba(255,255,255,0.9) 50%, transparent 75%)',
              }}
              initial={{ x: '-110%' }}
              animate={{ x: '210%' }}
              transition={{ duration: 0.55, delay: 0.18, ease: 'easeOut' }}
            />
          )}

          <div className="w-[14px] h-[14px] relative z-20 flex items-center justify-center flex-shrink-0">
            {icon}
          </div>
          <div className="text-[#37322F] text-xs font-medium leading-3 font-sans relative z-20 whitespace-nowrap">
            {text}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
