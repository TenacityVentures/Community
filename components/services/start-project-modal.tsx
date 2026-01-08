"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface StartProjectModalProps {
  isOpen: boolean
  onClose: () => void
  defaultService?: string
}

const stages = [
  { value: "idea", label: "💡 Just an idea", emoji: "💡" },
  { value: "validated", label: "✅ Validated concept", emoji: "✅" },
  { value: "prototype", label: "🛠️ Early prototype/MVP", emoji: "🛠️" },
  { value: "traction", label: "📈 Have traction, need to scale", emoji: "📈" },
  { value: "ready", label: "🚀 Ready to dominate", emoji: "🚀" },
]

const needs = [
  "Strategy & validation",
  "Product development",
  "Brand & go-to-market",
  "Full venture build",
  "Not sure, let's figure it out",
]

const audiences = [
  "B2B (Business to Business)",
  "B2C (Business to Consumer)",
  "Marketplace",
  "Platform",
  "SaaS",
  "Not sure yet",
]

export function StartProjectModal({ isOpen, onClose, defaultService }: StartProjectModalProps) {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form fields
  const [problem, setProblem] = useState("")
  const [vision, setVision] = useState("")
  const [audience, setAudience] = useState("")
  const [stage, setStage] = useState("")
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([])
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [bestTime, setBestTime] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/start-project', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          problem,
          vision,
          audience,
          stage,
          needs: selectedNeeds,
          name,
          email,
          phone,
          bestTime,
          service: defaultService,
          timestamp: new Date().toISOString(),
        }),
      })

      if (response.ok) {
        setStep(4)
        setTimeout(() => {
          handleClose()
        }, 3000)
      }
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    onClose()
    setTimeout(() => {
      setStep(1)
      setProblem("")
      setVision("")
      setAudience("")
      setStage("")
      setSelectedNeeds([])
      setName("")
      setEmail("")
      setPhone("")
      setBestTime("")
    }, 300)
  }

  const toggleNeed = (need: string) => {
    setSelectedNeeds((prev) =>
      prev.includes(need) ? prev.filter((n) => n !== need) : [...prev, need]
    )
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.35 }}
            className="bg-white rounded-2xl shadow-2xl p-8 sm:p-12 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-[#605A57] font-bold text-xl cursor-pointer hover:text-[#37322F] z-10"
              onClick={handleClose}
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
                  <h2 className="text-2xl sm:text-3xl font-semibold text-[#37322F] mb-2">
                    What are you building?
                  </h2>
                  <p className="text-[#605A57] text-sm mb-2">
                    Start with your vision. We'll figure out the rest together.
                  </p>

                  <textarea
                    placeholder="What problem are you solving? *"
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    rows={4}
                    className="border border-[#E0DEDB] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#322D2B] text-[#37322F] resize-none"
                    required
                  />

                  <textarea
                    placeholder="What's the vision? (Optional)"
                    value={vision}
                    onChange={(e) => setVision(e.target.value)}
                    rows={3}
                    className="border border-[#E0DEDB] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#322D2B] text-[#37322F] resize-none"
                  />

                  <select
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    className="border border-[#E0DEDB] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#322D2B] text-[#37322F]"
                  >
                    <option value="">Who is this for? (Optional)</option>
                    {audiences.map((aud) => (
                      <option key={aud} value={aud}>
                        {aud}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => {
                      if (problem) setStep(2)
                    }}
                    disabled={!problem}
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
                    Where are you at?
                  </h2>

                  <div className="mb-2">
                    <p className="text-sm font-medium text-[#37322F] mb-3">Current stage *</p>
                    <div className="grid grid-cols-1 gap-3">
                      {stages.map((s) => (
                        <button
                          key={s.value}
                          onClick={() => setStage(s.value)}
                          className={`text-left border-2 rounded-lg px-5 py-3 transition-all duration-300 hover:border-[#37322F] hover:bg-[#F7F5F3] ${
                            stage === s.value ? "border-[#37322F] bg-[#F7F5F3]" : "border-[#E0DEDB]"
                          }`}
                        >
                          <div className="font-semibold text-[#37322F]">{s.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm font-medium text-[#37322F] mb-3">What do you need most? (Select all that apply)</p>
                    <div className="grid grid-cols-1 gap-2">
                      {needs.map((need) => (
                        <button
                          key={need}
                          onClick={() => toggleNeed(need)}
                          className={`text-left border rounded-lg px-4 py-2 transition-all duration-300 text-sm ${
                            selectedNeeds.includes(need)
                              ? "border-[#37322F] bg-[#F7F5F3] text-[#37322F]"
                              : "border-[#E0DEDB] text-[#605A57] hover:border-[#37322F]"
                          }`}
                        >
                          <span className="mr-2">{selectedNeeds.includes(need) ? "✓" : "○"}</span>
                          {need}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 mt-2">
                    <button
                      onClick={() => setStep(1)}
                      className="text-[#605A57] text-sm hover:text-[#37322F] transition-colors"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={() => {
                        if (stage) setStep(3)
                      }}
                      disabled={!stage}
                      className="flex-1 bg-[#37322F] text-white rounded-full px-6 py-3 font-medium hover:bg-[#4a443f] transition-all duration-300 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
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
                  <h2 className="text-2xl sm:text-3xl font-semibold text-[#37322F] mb-2">
                    Let's connect
                  </h2>
                  <p className="text-[#605A57] text-sm mb-2">
                    We'll get back to you within 24 hours.
                  </p>

                  <input
                    type="text"
                    placeholder="Your Name *"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border border-[#E0DEDB] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#322D2B] text-[#37322F]"
                    required
                  />

                  <input
                    type="email"
                    placeholder="Email Address *"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border border-[#E0DEDB] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#322D2B] text-[#37322F]"
                    required
                  />

                  <input
                    type="tel"
                    placeholder="WhatsApp/Phone (Optional)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="border border-[#E0DEDB] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#322D2B] text-[#37322F]"
                  />

                  <select
                    value={bestTime}
                    onChange={(e) => setBestTime(e.target.value)}
                    className="border border-[#E0DEDB] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#322D2B] text-[#37322F]"
                  >
                    <option value="">Best time to chat? (Optional)</option>
                    <option value="Morning (9am - 12pm)">Morning (9am - 12pm)</option>
                    <option value="Afternoon (12pm - 5pm)">Afternoon (12pm - 5pm)</option>
                    <option value="Evening (5pm - 8pm)">Evening (5pm - 8pm)</option>
                    <option value="Flexible">Flexible</option>
                  </select>

                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !name || !email}
                    className="bg-[#37322F] text-white rounded-full px-6 py-3 font-medium hover:bg-[#4a443f] transition-all duration-300 disabled:opacity-50"
                  >
                    {isSubmitting ? "Submitting..." : "Let's build"}
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
                  <div className="w-16 h-16 bg-[#37322F] rounded-full flex items-center justify-center mb-2">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-semibold text-[#37322F]">
                    Let's build together
                  </h2>
                  <p className="text-[#605A57] text-base sm:text-lg">
                    Thanks {name}! We're excited about what you're building. We'll reach out within 24 hours.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
