// ethos-scroll-cards.tsx
"use client"
import { useRef, useEffect, useState } from "react"
import type React from "react"

import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion"

interface EthosScrollCardsProps {
  activeCard: number
  onCardClick: (index: number) => void
}

export function EthosScrollCards({ activeCard, onCardClick }: EthosScrollCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Smooth spring animations for mouse movement
  const smoothMouseX = useSpring(mouseX, { stiffness: 100, damping: 20 })
  const smoothMouseY = useSpring(mouseY, { stiffness: 100, damping: 20 })

  // 3D rotation values
  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [5, -5])
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-5, 5])

  const parallaxX = useTransform(smoothMouseX, [-0.5, 0.5], [-20, 20])
  const parallaxY = useTransform(smoothMouseY, [-0.5, 0.5], [-20, 20])

  const cards = [
    {
      src: "/ethosone-boldness-over-perfection.png",
      alt: "Boldness over perfection",
      description: "Boldness over perfection",
    },
    {
      src: "/david-samuel-peter.png",
      alt: "Bold Builders at Tenacity",
      description: "Bold Builders and Narratives at Tenacity",
    },
    {
      src: "/data-visualization-dashboard-with-interactive-char.jpg",
      alt: "Fearless Ventures and Products",
      description: "Fearless Ventures and Products",
    },
  ]

  const cardTransforms = cards.map((_, index) => {
    const isActive = index === activeCard
    const scale = 0.95 + 0.05 * scrollProgress
    const translateY = 20 * (1 - scrollProgress)
    const opacity = scrollProgress

    const zPosition = isActive ? 0 : -100 - Math.abs(index - activeCard) * 50
    const cardScale = isActive ? 1 : 0.9

    return {
      rotateX: isActive ? rotateX : 0,
      rotateY: isActive ? rotateY : 0,
      transformStyle: "preserve-3d",
      zIndex: isActive ? 10 : 0,
      z: zPosition,
      scale: isActive ? scale * cardScale : cardScale * 0.95,
      y: isActive ? translateY : 20,
      opacity: isActive ? opacity : 0,
      filter: isActive ? "blur(0px)" : "blur(4px)",
    }
  })

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight

      let progress = 0
      if (rect.top < windowHeight && rect.bottom > 0) {
        const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0)
        progress = visibleHeight / rect.height
        progress = Math.min(Math.max(progress, 0), 1)
      }
      setScrollProgress(progress)
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const x = (e.clientX - centerX) / (rect.width / 2)
    const y = (e.clientY - centerY) / (rect.height / 2)
    mouseX.set(x)
    mouseY.set(y)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  const buttonRefs = useRef<HTMLButtonElement[]>([])
  const [buttonPositions, setButtonPositions] = useState<{ x: number; y: number }[]>(cards.map(() => ({ x: 0, y: 0 })))

  const handleButtonMouseMove = (e: React.MouseEvent<HTMLButtonElement>, index: number) => {
    if (!buttonRefs.current[index]) return
    const rect = buttonRefs.current[index].getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const distance = Math.sqrt(Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2))

    if (distance < 80) {
      const strength = Math.max(0, 1 - distance / 80)
      const pullX = (e.clientX - centerX) * strength * 0.3
      const pullY = (e.clientY - centerY) * strength * 0.3
      setButtonPositions((prevPositions) => {
        const newPositions = [...prevPositions]
        newPositions[index] = { x: pullX, y: pullY }
        return newPositions
      })
    } else {
      setButtonPositions((prevPositions) => {
        const newPositions = [...prevPositions]
        newPositions[index] = { x: 0, y: 0 }
        return newPositions
      })
    }
  }

  const handleButtonMouseLeave = (index: number) => {
    setButtonPositions((prevPositions) => {
      const newPositions = [...prevPositions]
      newPositions[index] = { x: 0, y: 0 }
      return newPositions
    })
  }

  return (
    <div className="w-full flex flex-col justify-center items-center gap-8">
      <motion.div
        ref={containerRef}
        className="relative w-full h-[500px] sm:h-[600px] md:h-[700px] lg:h-[800px] flex justify-center items-center overflow-hidden"
        style={{
          perspective: 1000,
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          className="absolute inset-0 rounded-lg pointer-events-none"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            background:
              "radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(55, 50, 47, 0.15), transparent 40%)",
          }}
        />

        <AnimatePresence mode="wait">
          {cards.map((card, index) => {
            const isActive = index === activeCard
            const transform = cardTransforms[index]

            return (
              <motion.div
                key={index}
                className="absolute inset-0 isolate"
                style={transform}
                animate={{
                  opacity: isActive ? transform.opacity : 0,
                  scale: transform.scale,
                  y: transform.y,
                  z: transform.z,
                  filter: transform.filter,
                }}
                transition={{
                  duration: 0.6,
                  ease: [0.43, 0.13, 0.23, 0.96], // Custom cubic-bezier for smooth effect
                  opacity: { duration: 0.4 },
                  filter: { duration: 0.5 },
                }}
              >
                <motion.img
                  src={card.src}
                  alt={card.alt}
                  className={`w-full ${card.src === '/david-samuel-peter.png' ? 'h-2/4' : 'h-full'} object-cover object-center md:object-bottom`}
                  style={{
                    x: isActive ? parallaxX : 0,
                    y: isActive ? parallaxY : 0,
                  }}
                  initial={false}
                  animate={{
                    scale: isActive ? 1 : 0.95,
                    opacity: isActive ? 1 : 0,
                  }}
                  transition={{
                    duration: 0.6,
                    ease: [0.43, 0.13, 0.23, 0.96],
                    scale: { duration: 0.7 },
                  }}
                />
              </motion.div>
            )
          })}
        </AnimatePresence>
      </motion.div>

      <div className="flex gap-4">
        {cards.map((card, index) => {
          const position = buttonPositions[index]

          return (
            <motion.button
              key={index}
              ref={(el) => {
                buttonRefs.current[index] = el as HTMLButtonElement
              }}
              className={`px-4 py-2 rounded-full border ${index === activeCard ? "bg-[#37322F] text-white" : "bg-white text-[#37322F] border-[#E0DEDB]"}`}
              onClick={() => onCardClick(index)}
              onMouseMove={(e) => handleButtonMouseMove(e, index)}
              onMouseLeave={() => handleButtonMouseLeave(index)}
              animate={{
                x: position.x,
                y: position.y,
              }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 20,
              }}
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: 0.95,
              }}
            >
              {card.description}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
