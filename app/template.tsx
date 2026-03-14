'use client'

import { motion } from 'framer-motion'

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Curtain overlay that sweeps upward to reveal the page */}
      <motion.div
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
        className="fixed inset-0 z-[200] bg-[#37322f] pointer-events-none"
        style={{ transformOrigin: '50% 0%' }}
      />

      {/* Secondary accent stripe — gives a layered depth effect */}
      <motion.div
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1], delay: 0.05 }}
        className="fixed inset-0 z-[199] bg-[#f7f5f3] pointer-events-none"
        style={{ transformOrigin: '50% 0%' }}
      />

      {/* Children render immediately — curtain is the reveal, nav items handle their own entrance */}
      {children}
    </>
  )
}
