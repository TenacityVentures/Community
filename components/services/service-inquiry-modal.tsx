"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface ServiceInquiryModalProps {
  isOpen: boolean
  onClose: () => void
  defaultService?: string
}

const services = [
  "Venture Building",
  "Brand & Narrative",
  "Product & Engineering",
  "Growth & Scale",
  "Not sure yet",
]

export function ServiceInquiryModal({ isOpen, onClose, defaultService }: ServiceInquiryModalProps) {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form fields
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [company, setCompany] = useState("")
  const [selectedService, setSelectedService] = useState(defaultService || "")
  const [projectBrief, setProjectBrief] = useState("")
  const [timeline, setTimeline] = useState("")
  const [budget, setBudget] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/service-inquiry', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          company,
          service: selectedService,
          projectBrief,
          timeline,
          budget,
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
      setName("")
      setEmail("")
      setCompany("")
      setSelectedService(defaultService || "")
      setProjectBrief("")
      setTimeline("")
      setBudget("")
    }, 300)
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
                    Let's build together
                  </h2>
                  <p className="text-[#605A57] text-sm mb-2">
                    Tell us about yourself and we'll get back to you within 24 hours.
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
                    type="text"
                    placeholder="Company / Venture (Optional)"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="border border-[#E0DEDB] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#322D2B] text-[#37322F]"
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
                    Which service are you interested in?
                  </h2>

                  <div className="grid grid-cols-1 gap-3">
                    {services.map((service) => (
                      <button
                        key={service}
                        onClick={() => {
                          setSelectedService(service)
                          setStep(3)
                        }}
                        className={`text-left border-2 rounded-lg px-5 py-4 transition-all duration-300 hover:border-[#37322F] hover:bg-[#F7F5F3] ${
                          selectedService === service ? "border-[#37322F] bg-[#F7F5F3]" : "border-[#E0DEDB]"
                        }`}
                      >
                        <div className="font-semibold text-[#37322F]">{service}</div>
                      </button>
                    ))}
                  </div>

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
                  <h2 className="text-2xl sm:text-3xl font-semibold text-[#37322F] mb-2">
                    Tell us about your project
                  </h2>

                  <textarea
                    placeholder="What are you building? What's the vision? *"
                    value={projectBrief}
                    onChange={(e) => setProjectBrief(e.target.value)}
                    rows={5}
                    className="border border-[#E0DEDB] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#322D2B] text-[#37322F] resize-none"
                    required
                  />

                  <select
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    className="border border-[#E0DEDB] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#322D2B] text-[#37322F]"
                  >
                    <option value="">Timeline (Optional)</option>
                    <option value="ASAP">ASAP - Need to start immediately</option>
                    <option value="1-3 months">1-3 months</option>
                    <option value="3-6 months">3-6 months</option>
                    <option value="6+ months">6+ months</option>
                    <option value="Exploring">Just exploring</option>
                  </select>

                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="border border-[#E0DEDB] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#322D2B] text-[#37322F]"
                  >
                    <option value="">Budget Range (Optional)</option>
                    <option value="< $10K">Less than $10K</option>
                    <option value="$10K - $50K">$10K - $50K</option>
                    <option value="$50K - $100K">$50K - $100K</option>
                    <option value="$100K+">$100K+</option>
                    <option value="Not sure">Not sure yet</option>
                  </select>

                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !projectBrief}
                    className="bg-[#37322F] text-white rounded-full px-6 py-3 font-medium hover:bg-[#4a443f] transition-all duration-300 disabled:opacity-50"
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
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
                  <h2 className="text-2xl sm:text-3xl font-semibold text-[#37322F]">We'll be in touch soon</h2>
                  <p className="text-[#605A57] text-base sm:text-lg">
                    Thanks {name}! We'll review your project and get back to you within 24 hours.
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
