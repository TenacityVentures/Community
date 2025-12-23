"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function CTASection() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [engagementType, setEngagementType] = useState("")
  const [bio, setBio] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      // Replace with your n8n webhook URL
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
        // Reset form after a delay
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
    <div className="w-full relative overflow-hidden flex flex-col justify-center items-center gap-2">
      {/* Content */}
      <div className="self-stretch px-6 md:px-24 py-12 md:py-12 border-t border-b border-[rgba(55,50,47,0.12)] flex justify-center items-center gap-6 relative z-10">
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <div className="w-full h-full relative">
            {Array.from({ length: 300 }).map((_, i) => (
              <div
                key={i}
                className="absolute h-4 w-full rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"
                style={{
                  top: `${i * 16 - 120}px`,
                  left: "-100%",
                  width: "300%",
                }}
              ></div>
            ))}
          </div>
        </div>

        <div className="w-full max-w-[586px] px-6 py-5 md:py-8 overflow-hidden rounded-lg flex flex-col justify-start items-center gap-6 relative z-20">
          <div className="self-stretch flex flex-col justify-start items-start gap-3">
            <div className="self-stretch text-center flex justify-center flex-col text-[#49423D] text-3xl md:text-5xl font-semibold leading-tight md:leading-[56px] font-sans tracking-tight">
              Ready to Build?
            </div>
            <div className="self-stretch text-center text-[#605A57] text-base leading-7 font-sans font-medium">
              This is your invitation.
              <br />
              To think bigger.
              <br />
              To act boldly.
              <br />
              To create something that matters.
            </div>
          </div>
          <div className="w-full max-w-[497px] flex flex-col justify-center items-center gap-12">
            <div className="flex justify-start items-center gap-4">
              <button
                className="h-10 px-12 py-[6px] relative bg-[#37322F] shadow-[0px_0px_0px_2.5px_rgba(255,255,255,0.08)_inset] overflow-hidden rounded-full flex justify-center items-center cursor-pointer hover:bg-[#2A2520] transition-colors"
                onClick={() => {
                  setIsModalOpen(true)
                }}
              >
                <div className="w-44 h-[41px] absolute left-0 top-0 bg-gradient-to-b from-[rgba(255,255,255,0)] to-[rgba(0,0,0,0.10)] mix-blend-multiply"></div>
                <div className="flex flex-col justify-center text-white text-[13px] font-medium leading-5 font-sans">
                  Join Tenacity
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

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
                {/* Step 1: Name and Email */}
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

                {/* Step 2: Choose Engagement Type */}
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

                {/* Step 3: Tell Us More (Bio - Optional) */}
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

                {/* Step 4: Welcome Message */}
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
    </div>
  )
}
