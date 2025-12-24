"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { AnimatePresence } from "framer-motion"

export function HeroSection() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [engagementType, setEngagementType] = useState("")
  const [bio, setBio] = useState("")

  const heroRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [5, -5]), {
    stiffness: 150,
    damping: 20,
  })
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-5, 5]), {
    stiffness: 150,
    damping: 20,
  })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroRef.current) return
    const rect = heroRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    mouseX.set(e.clientX - centerX)
    mouseY.set(e.clientY - centerY)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || "YOUR_N8N_WEBHOOK_URL"

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          engagementType,
          bio,
          timestamp: new Date().toISOString(),
        }),
      })

      if (response.ok) {
        setStep(4)
        setTimeout(() => {
          setName("")
          setEmail("")
          setEngagementType("")
          setBio("")
        }, 2000)
      }
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setTimeout(() => {
      setStep(1)
      setName("")
      setEmail("")
      setEngagementType("")
      setBio("")
    }, 300)
  }

  return (
    <section className="relative pb-16 flex flex-col justify-center items-center w-full mt-12 md:mt-0">
      <motion.div
        ref={heroRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="text-center max-w-2xl"
      >
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-normal text-[#37322F] leading-tight mb-4">
          <MagneticText>An Ecosystem for Ventures,</MagneticText>{" "}
          <motion.span
            drag
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={0.7}
            dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
            className="bg-[#37322f]/5 p-2 rounded-md inline-block cursor-grab active:cursor-grabbing"
            whileDrag={{ scale: 1.05 }}
          >
            Builders
          </motion.span>{" "}
          <MagneticText>and Stories.</MagneticText>
        </h1>
        <p className="text-[#605A57] text-sm sm:text-base md:text-lg mb-6">
          We're building something extraordinary. Join the movement of founders and builders creating Africa's future.
        </p>

        <button
          className="relative bg-[#37322F] text-white px-8 py-3 rounded-full font-medium hover:bg-[#4a443f] transition-all duration-300"
          onClick={() => setIsModalOpen(true)}
        >
          Join for free
        </button>
      </motion.div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35 }}
              className="bg-white rounded-2xl shadow-2xl p-8 sm:p-12 w-[90%] max-w-lg relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 text-[#605A57] font-bold text-xl cursor-pointer hover:cursor-pointer hover:text-[#37322F]"
                onClick={closeModal}
              >
                &times;
              </button>

              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-4"
                  >
                    <h2 className="text-2xl sm:text-3xl font-semibold text-[#37322F] mb-2">Join Tenacity</h2>
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="border border-[#E0DEDB] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#322D2B] text-[#37322F]"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border border-[#E0DEDB] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#322D2B] text-[#37322F]"
                      required
                    />
                    <button
                      onClick={() => {
                        if (name && email) setStep(2)
                      }}
                      disabled={!name || !email}
                      className="bg-[#37322F] text-white rounded-full px-6 py-3 font-medium hover:bg-[#4a443f] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-4"
                  >
                    <h2 className="text-2xl sm:text-3xl font-semibold text-[#37322F] mb-2">
                      How do you want to engage?
                    </h2>

                    <button
                      onClick={() => {
                        setEngagementType("Build with us")
                        setStep(3)
                      }}
                      className={`text-left border-2 rounded-lg px-5 py-4 transition-all duration-300 hover:border-[#37322F] hover:bg-[#F7F5F3] ${
                        engagementType === "Build with us" ? "border-[#37322F] bg-[#F7F5F3]" : "border-[#E0DEDB]"
                      }`}
                    >
                      <div className="font-semibold text-[#37322F] mb-1">Build with us</div>
                      <div className="text-sm text-[#605A57]">
                        Collaborate on ventures, contribute skills, join projects
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setEngagementType("Partner with us")
                        setStep(3)
                      }}
                      className={`text-left border-2 rounded-lg px-5 py-4 transition-all duration-300 hover:border-[#37322F] hover:bg-[#F7F5F3] ${
                        engagementType === "Partner with us" ? "border-[#37322F] bg-[#F7F5F3]" : "border-[#E0DEDB]"
                      }`}
                    >
                      <div className="font-semibold text-[#37322F] mb-1">Partner with us</div>
                      <div className="text-sm text-[#605A57]">
                        Organizations, brands, and teams can partner on innovation, storytelling, or impact initiatives
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setEngagementType("Grow with us")
                        setStep(3)
                      }}
                      className={`text-left border-2 rounded-lg px-5 py-4 transition-all duration-300 hover:border-[#37322F] hover:bg-[#F7F5F3] ${
                        engagementType === "Grow with us" ? "border-[#37322F] bg-[#F7F5F3]" : "border-[#E0DEDB]"
                      }`}
                    >
                      <div className="font-semibold text-[#37322F] mb-1">Grow with us</div>
                      <div className="text-sm text-[#605A57]">
                        Learn, gain exposure, access opportunities, and evolve as a builder
                      </div>
                    </button>

                    <button
                      onClick={() => setStep(1)}
                      className="text-[#605A57] text-sm mt-2 hover:text-[#37322F] transition-colors"
                    >
                      ← Back
                    </button>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-4"
                  >
                    <h2 className="text-2xl sm:text-3xl font-semibold text-[#37322F] mb-2">Tell us more</h2>
                    <p className="text-sm text-[#605A57] -mt-2">Optional</p>

                    <textarea
                      placeholder="Share a bit about yourself, your interests, or what you're working on..."
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={5}
                      className="border border-[#E0DEDB] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#322D2B] text-[#37322F] resize-none"
                    />

                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="bg-[#37322F] text-white rounded-full px-6 py-3 font-medium hover:bg-[#4a443f] transition-all duration-300 disabled:opacity-50"
                    >
                      {isSubmitting ? "Submitting..." : "Continue"}
                    </button>

                    <button
                      onClick={() => setStep(2)}
                      className="text-[#605A57] text-sm hover:text-[#37322F] transition-colors"
                    >
                      ← Back
                    </button>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col items-center justify-center gap-4 text-center py-8"
                  >
                    <h2 className="text-2xl sm:text-3xl font-semibold text-[#37322F]">Think. Build. Do. Grow.</h2>
                    <p className="text-[#605A57] text-base sm:text-lg">Welcome to Tenacity.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

function MagneticText({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springConfig = { damping: 20, stiffness: 150 }
  const xSpring = useSpring(x, springConfig)
  const ySpring = useSpring(y, springConfig)

  const handleMouseMove = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const distanceX = e.clientX - centerX
    const distanceY = e.clientY - centerY
    const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2)

    if (distance < 150) {
      const strength = (150 - distance) / 150
      x.set(distanceX * strength * 0.3)
      y.set(distanceY * strength * 0.3)
    }
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.span
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        x: xSpring,
        y: ySpring,
        display: "inline-block",
      }}
    >
      {children}
    </motion.span>
  )
}
