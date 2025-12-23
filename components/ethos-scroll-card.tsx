// ethos-scroll-cards.tsx
"use client"
import { useRef, useEffect, useState } from "react"

interface EthosScrollCardsProps {
  activeCard: number
  onCardClick: (index: number) => void
}

export function EthosScrollCards({ activeCard, onCardClick }: EthosScrollCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  const cards = [
    { src: "/ethosone-boldness-over-perfection.png", alt: "Boldness over perfection", description: "Boldness over perfection" },
    { src: "/david-samuel-peter.png", alt: "Bold Builders at Tenacity", description: "Bold Builders and Narratives at Tenacity" },
    { src: "/data-visualization-dashboard-with-interactive-char.jpg", alt: "Fearless Ventures and Products", description: "Fearless Ventures and Products" },
  ]

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

  return (
    <div className="w-full flex flex-col justify-center items-center gap-8">
      <div ref={containerRef} className="relative w-full h-[500px] sm:h-[600px] md:h-[700px] lg:h-[800px] flex justify-center items-center overflow-hidden">
        {cards.map((card, index) => {
          const isActive = index === activeCard
          const scale = 0.95 + 0.05 * scrollProgress
          const translateY = 20 * (1 - scrollProgress)
          const opacity = scrollProgress

          return (
            <div
              key={index}
              className="absolute inset-0 transition-transform duration-0 ease-linear"
              style={{
                transform: isActive ? `translateY(${translateY}px) scale(${scale})` : "scale(0.95) translateY(20px)",
                opacity: isActive ? opacity : 0,
                zIndex: isActive ? 10 : 0,
              }}
            >
              <img src={card.src} alt={card.alt} className="w-full h-full object-cover object-bottom" />
            </div>
          )
        })}
      </div>

      <div className="flex gap-4">
        {cards.map((card, index) => (
          <button
            key={index}
            className={`px-4 py-2 rounded-full border ${index === activeCard ? "bg-[#37322F] text-white" : "bg-white text-[#37322F] border-[#E0DEDB]"}`}
            onClick={() => onCardClick(index)}
          >
            {card.description}
          </button>
        ))}
      </div>
    </div>
  )
}
