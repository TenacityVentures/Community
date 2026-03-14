'use client'

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion"
import { useRef, Fragment } from "react"
import FooterSection from "@/components/footer-section"
import { Header } from "@/components/header"
import { MagicBadge } from "@/components/magic-badge"

// ─── Hero word slide-up ───────────────────────────────────────────────────────
// Each word clips through an overflow-hidden gate, sliding up into view.

function HeroWord({ word, delay }: { word: string; delay: number }) {
  return (
    <Fragment>
      <span
        className="inline-block overflow-hidden align-bottom"
        style={{ paddingBottom: '0.08em', marginBottom: '-0.08em' }}
      >
        <motion.span
          className="inline-block"
          initial={{ y: '110%' }}
          animate={{ y: 0 }}
          transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
        >
          {word}
        </motion.span>
      </span>
      {' '}
    </Fragment>
  )
}

// ─── Scroll-linked word opacity ───────────────────────────────────────────────
// Each word is its own component so the hook call is at component level.

function AnimatedWord({
  word,
  progress,
  index,
  total,
}: {
  word: string
  progress: MotionValue<number>
  index: number
  total: number
}) {
  const wordStart = (index / total) * 0.8
  const wordEnd = wordStart + (1.6 / total)
  const opacity = useTransform(progress, [wordStart, Math.min(wordEnd, 1)], [0.15, 1])
  return (
    <motion.span style={{ opacity }} className="inline">
      {word}{' '}
    </motion.span>
  )
}

function ScrollRevealParagraph({
  text,
  className,
}: {
  text: string
  className?: string
}) {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.88', 'end 0.25'],
  })
  const words = text.split(' ')
  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => (
        <AnimatedWord
          key={i}
          word={word}
          progress={scrollYProgress}
          index={i}
          total={words.length}
        />
      ))}
    </p>
  )
}

// Badge is now the shared MagicBadge — alias for convenience in this file
const Badge = MagicBadge

// ─── Page ─────────────────────────────────────────────────────────────────────

const H1_WORDS = ['This', 'is', 'for', 'the', 'builders', 'who', 'refuse', 'to', 'wait.']
// Nav finishes ~1.47s (last item at 1.02 + 0.45). Line draws at 1.15s, words start 1.25s.
const WORD_BASE_DELAY = 1.25
const WORD_STAGGER = 0.06

export default function Manifesto() {
  const principles = [
    {
      title: "Think",
      description: "Question everything. Challenge assumptions. See problems as opportunities waiting to be unlocked.",
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 8C13.373 8 8 13.373 8 20C8 26.627 13.373 32 20 32C26.627 32 32 26.627 32 20C32 13.373 26.627 8 20 8Z" stroke="#37322F" strokeWidth="2" fill="none" />
          <circle cx="16" cy="18" r="1.5" fill="#37322F" />
          <circle cx="24" cy="18" r="1.5" fill="#37322F" />
          <path d="M15 25C15 25 17 27 20 27C23 27 25 25 25 25" stroke="#37322F" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    },
    {
      title: "Build",
      description: "Turn ideas into reality. Create solutions that matter. Make things that move the world forward.",
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="16" width="8" height="16" stroke="#37322F" strokeWidth="2" fill="none" />
          <rect x="22" y="10" width="8" height="22" stroke="#37322F" strokeWidth="2" fill="none" />
          <rect x="12" y="20" width="2" height="2" fill="#37322F" />
          <rect x="15" y="20" width="2" height="2" fill="#37322F" />
          <rect x="24" y="14" width="2" height="2" fill="#37322F" />
          <rect x="27" y="14" width="2" height="2" fill="#37322F" />
        </svg>
      )
    },
    {
      title: "Do",
      description: "Execution is everything. Take action. Ship fast, learn faster, and iterate relentlessly.",
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 20L18 26L28 14" stroke="#37322F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <circle cx="20" cy="20" r="12" stroke="#37322F" strokeWidth="2" fill="none" />
        </svg>
      )
    },
    {
      title: "Grow",
      description: "Never stop learning. Embrace failure as feedback. Evolve constantly, personally and professionally.",
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 28L15 22L20 25L25 18L30 12" stroke="#37322F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M26 12H30V16" stroke="#37322F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    }
  ]

  const beliefs = [
    { title: "Builders over talkers", description: "We value action. Ideas are abundant, execution is rare. We celebrate those who ship." },
    { title: "Impact over perfection", description: "Done is better than perfect. We launch, learn, and improve. Iteration beats procrastination." },
    { title: "Community over competition", description: "We rise together. Sharing knowledge, resources, and opportunities makes everyone stronger." },
    { title: "Courage over comfort", description: "Growth lives outside your comfort zone. We embrace risk, uncertainty, and the possibility of failure." },
    { title: "Purpose over profit", description: "Profit follows purpose. We build ventures that solve real problems and create meaningful impact." },
    { title: "Learning over knowing", description: "Curiosity drives innovation. We stay humble, ask questions, and learn from everyone and everything." }
  ]

  return (
    <div className="w-full min-h-screen relative bg-[#F7F5F3] overflow-x-hidden flex flex-col justify-start items-center">
      <div className="relative flex flex-col justify-start items-center w-full">
        <div className="w-full max-w-none px-4 sm:px-6 md:px-8 lg:px-0 lg:max-w-[1060px] lg:w-[1060px] relative flex flex-col justify-start items-start min-h-screen">
          {/* Left vertical line */}
          <div className="w-[1px] h-full absolute left-4 sm:left-6 md:left-8 lg:left-0 top-0 bg-[rgba(55,50,47,0.12)] shadow-[1px_0px_0px_white] z-0" />
          {/* Right vertical line */}
          <div className="w-[1px] h-full absolute right-4 sm:right-6 md:right-8 lg:right-0 top-0 bg-[rgba(55,50,47,0.12)] shadow-[1px_0px_0px_white] z-0" />

          <Header />

          <div className="pt-12 sm:pt-16 md:pt-20 lg:pt-[116px] pb-8 sm:pb-12 md:pb-16 flex flex-col justify-start items-center px-2 sm:px-4 md:px-8 lg:px-0 w-full">

            {/* ── Hero ── */}
            <section className="relative pb-16 flex flex-col justify-center items-center w-full mt-12 md:mt-0">
              <div className="text-center max-w-3xl px-4">

                {/* Line that draws outward from center */}
                <div className="flex justify-center mb-6">
                  <motion.div
                    className="h-[2px] bg-[#37322F]"
                    style={{ width: '200px', transformOrigin: 'center' }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.7, delay: 1.15, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>

                {/* H1 — word-by-word gate reveal */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-normal text-[#37322F] leading-tight mb-6">
                  {H1_WORDS.map((word, i) => (
                    <HeroWord
                      key={i}
                      word={word}
                      delay={WORD_BASE_DELAY + i * WORD_STAGGER}
                    />
                  ))}
                </h1>

                {/* Subtitle — fades in after the h1 sequence */}
                <motion.p
                  className="text-[#605A57] text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl mx-auto"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 1.75, ease: 'easeOut' }}
                >
                  For those who see the world not as it is, but as it could be. For the fearless ones who turn ideas into action,
                  who build, ship, and iterate without permission.
                </motion.p>
              </div>
            </section>

            {/* ── Opening Statement — scroll-linked word lighting ── */}
            <section className="w-full border-t border-b border-[rgba(55,50,47,0.12)] py-16 sm:py-20 md:py-24 mb-16">
              <div className="max-w-3xl mx-auto px-4 sm:px-6">
                <div className="space-y-8 text-[#37322F]">
                  <ScrollRevealParagraph
                    text="Tenacity isn't just a company. It's a mindset. A movement. A home for those who believe that action speaks louder than ambition."
                    className="text-lg sm:text-xl md:text-2xl leading-relaxed font-medium"
                  />
                  <ScrollRevealParagraph
                    text="We exist because too many ideas die in conversations. Too many dreams fade in waiting. Too many builders work in isolation, unsure where to start or who to build with."
                    className="text-base sm:text-lg md:text-xl leading-relaxed text-[#605A57]"
                  />
                  <ScrollRevealParagraph
                    text="We're changing that. We're creating the environment, the community, and the support system that turns thinkers into builders, builders into doers, and doers into movements."
                    className="text-base sm:text-lg md:text-xl leading-relaxed text-[#605A57]"
                  />
                </div>
              </div>
            </section>

            {/* ── Four Pillars ── */}
            <section className="w-full mb-16 sm:mb-20 md:mb-24">
              <div className="max-w-4xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-12 sm:mb-16">
                  <Badge
                    icon={
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="1" y="1" width="5" height="5" stroke="#37322F" strokeWidth="1" fill="none" />
                        <rect x="8" y="1" width="5" height="5" stroke="#37322F" strokeWidth="1" fill="none" />
                        <rect x="1" y="8" width="5" height="5" stroke="#37322F" strokeWidth="1" fill="none" />
                        <rect x="8" y="8" width="5" height="5" stroke="#37322F" strokeWidth="1" fill="none" />
                      </svg>
                    }
                    text="Four Pillars"
                  />
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-normal text-[#37322F] mt-6 mb-4">
                    Think. Build. Do. Grow.
                  </h2>
                  <p className="text-[#605A57] text-base sm:text-lg max-w-2xl mx-auto">
                    These four principles guide everything we do. They're not just words—they're a way of life.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                  {principles.map((principle, index) => (
                    <motion.div
                      key={principle.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-white border border-[rgba(55,50,47,0.12)] rounded-xl p-6 sm:p-8 hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="mb-4">{principle.icon}</div>
                      <h3 className="text-2xl sm:text-3xl font-semibold text-[#37322F] mb-3">{principle.title}</h3>
                      <p className="text-[#605A57] text-base leading-relaxed">{principle.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* ── What We Believe ── */}
            <section className="w-full border-t border-[rgba(55,50,47,0.12)] py-16 sm:py-20 md:py-24 mb-16">
              <div className="max-w-4xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-12 sm:mb-16">
                  <Badge
                    icon={
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 2L7 12M2 7L12 7" stroke="#37322F" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    }
                    text="Core Beliefs"
                  />
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-normal text-[#37322F] mt-6 mb-4">
                    What We Believe
                  </h2>
                  <p className="text-[#605A57] text-base sm:text-lg max-w-2xl mx-auto">
                    Our values shape how we work, who we support, and what we build.
                  </p>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  {beliefs.map((belief, index) => (
                    <motion.div
                      key={belief.title}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-white border border-[rgba(55,50,47,0.12)] rounded-lg p-6 sm:p-8 hover:border-[#37322F] transition-colors duration-300"
                    >
                      <h3 className="text-xl sm:text-2xl font-semibold text-[#37322F] mb-2">{belief.title}</h3>
                      <p className="text-[#605A57] text-base leading-relaxed">{belief.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* ── The Movement ── */}
            <motion.section
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="w-full border-t border-b border-[rgba(55,50,47,0.12)] py-16 sm:py-20 md:py-24 mb-16"
            >
              <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
                <Badge
                  icon={
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="4" cy="4" r="2" stroke="#37322F" strokeWidth="1" fill="none" />
                      <circle cx="10" cy="4" r="2" stroke="#37322F" strokeWidth="1" fill="none" />
                      <circle cx="7" cy="10" r="2" stroke="#37322F" strokeWidth="1" fill="none" />
                      <path d="M5.5 5L5.5 9M8.5 5L8.5 9" stroke="#37322F" strokeWidth="1" />
                    </svg>
                  }
                  text="Join Us"
                />
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-normal text-[#37322F] mt-6 mb-6">
                  This is the movement.
                </h2>
                <div className="space-y-6 text-[#605A57] text-base sm:text-lg md:text-xl leading-relaxed">
                  <p>
                    Tenacity is for the builders who see problems and create solutions. For the dreamers who ship products, not pitches.
                    For the risk-takers who understand that failure is just data.
                  </p>
                  <p>
                    We're building ventures that matter. We're creating opportunities that didn't exist. We're telling stories that inspire action.
                  </p>
                  <p className="text-[#37322F] font-medium text-xl sm:text-2xl">
                    If you're ready to stop waiting and start building, you're already one of us.
                  </p>
                </div>
                <div className="mt-10">
                  <a
                    href="/"
                    className="inline-block bg-[#37322F] text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-[#4a443f] transition-all duration-300"
                  >
                    Join the movement
                  </a>
                </div>
              </div>
            </motion.section>

            <FooterSection />
          </div>
        </div>
      </div>
    </div>
  )
}
