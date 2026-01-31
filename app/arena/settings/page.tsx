"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/lib/supabase/auth-context"
import { motion } from "framer-motion"
import { ArrowLeft, X, Save, Check } from "lucide-react"

export default function SettingsPage() {
  const router = useRouter()
  const { user, profile, loading: authLoading, refreshProfile } = useAuth()
  const supabase = createClient()

  const [fullName, setFullName] = useState("")
  const [username, setUsername] = useState("")
  const [bio, setBio] = useState("")
  const [website, setWebsite] = useState("")
  const [skills, setSkills] = useState<string[]>([])
  const [skillInput, setSkillInput] = useState("")
  const [role, setRole] = useState<"builder" | "partner" | "learner">("builder")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/arena/login")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "")
      setUsername(profile.username || "")
      setBio(profile.bio || "")
      setWebsite(profile.website || "")
      setSkills(profile.skills || [])
      setRole(profile.role)
    }
  }, [profile])

  const handleAddSkill = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      const skill = skillInput.trim()
      if (skill && !skills.includes(skill) && skills.length < 10) {
        setSkills([...skills, skill])
        setSkillInput("")
      }
    }
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSaved(false)

    if (!username.trim()) {
      setError("Username is required")
      return
    }

    // Validate username format
    if (!/^[a-z0-9_-]+$/i.test(username)) {
      setError("Username can only contain letters, numbers, underscores, and hyphens")
      return
    }

    setSaving(true)

    const { error: updateError } = await (supabase
      .from("profiles") as any)
      .update({
        full_name: fullName.trim() || null,
        username: username.trim().toLowerCase(),
        bio: bio.trim() || null,
        website: website.trim() || null,
        skills: skills.length > 0 ? skills : null,
        role,
      })
      .eq("id", user!.id)

    if (updateError) {
      if (updateError.code === "23505") {
        setError("This username is already taken")
      } else {
        setError("Failed to update profile. Please try again.")
      }
      setSaving(false)
      return
    }

    await refreshProfile()
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#f7f5f3] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#37322f] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#f7f5f3]">
      {/* Header */}
      <header className="w-full border-b border-[#37322f]/6 bg-[#f7f5f3] sticky top-0 z-40">
        <div className="max-w-[600px] mx-auto px-4">
          <nav className="flex items-center justify-between py-4">
            <Link
              href={profile ? `/arena/profile/${profile.username}` : "/arena"}
              className="flex items-center gap-2 text-[#605A57] hover:text-[#37322f] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="flex items-center gap-2 bg-[#37322F] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#4a443f] transition-colors disabled:opacity-50"
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4" />
                  Saved
                </>
              ) : saving ? (
                "Saving..."
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save
                </>
              )}
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[600px] mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-instrument-serif text-3xl text-[#37322f] mb-2">Settings</h1>
          <p className="text-[#605A57] mb-8">Manage your profile and preferences</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Avatar Section */}
            <div className="bg-white rounded-xl border border-[#E0DEDB] p-6">
              <h2 className="font-medium text-[#37322f] mb-4">Profile Picture</h2>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-[#37322f] text-white flex items-center justify-center text-2xl font-medium overflow-hidden">
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.full_name || profile.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    (fullName?.[0] || username?.[0] || "U").toUpperCase()
                  )}
                </div>
                <p className="text-sm text-[#605A57]">
                  Profile picture is automatically set from your social login provider.
                </p>
              </div>
            </div>

            {/* Basic Info */}
            <div className="bg-white rounded-xl border border-[#E0DEDB] p-6 space-y-4">
              <h2 className="font-medium text-[#37322f] mb-2">Basic Information</h2>

              <div>
                <label className="block text-sm font-medium text-[#37322f] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full border-2 border-[#E0DEDB] rounded-lg px-4 py-2.5 text-[#37322f] focus:outline-none focus:border-[#37322f] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#37322f] mb-1">
                  Username <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center">
                  <span className="text-[#605A57] mr-1">@</span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase())}
                    placeholder="username"
                    className="flex-1 border-2 border-[#E0DEDB] rounded-lg px-4 py-2.5 text-[#37322f] focus:outline-none focus:border-[#37322f] transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#37322f] mb-1">
                  Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={4}
                  maxLength={500}
                  className="w-full border-2 border-[#E0DEDB] rounded-lg px-4 py-2.5 text-[#37322f] focus:outline-none focus:border-[#37322f] transition-colors resize-none"
                />
                <p className="text-xs text-[#605A57] mt-1">{bio.length}/500 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#37322f] mb-1">
                  Website
                </label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://yourwebsite.com"
                  className="w-full border-2 border-[#E0DEDB] rounded-lg px-4 py-2.5 text-[#37322f] focus:outline-none focus:border-[#37322f] transition-colors"
                />
              </div>
            </div>

            {/* Role */}
            <div className="bg-white rounded-xl border border-[#E0DEDB] p-6">
              <h2 className="font-medium text-[#37322f] mb-4">Your Role</h2>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: "builder", label: "Builder", icon: "🛠️" },
                  { value: "partner", label: "Partner", icon: "🤝" },
                  { value: "learner", label: "Learner", icon: "🌱" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setRole(option.value as typeof role)}
                    className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all ${
                      role === option.value
                        ? "border-[#37322f] bg-[#37322f]/5"
                        : "border-[#E0DEDB] hover:border-[#37322f]/30"
                    }`}
                  >
                    <span className="text-xl mb-1">{option.icon}</span>
                    <span className="text-sm font-medium text-[#37322f]">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-xl border border-[#E0DEDB] p-6">
              <h2 className="font-medium text-[#37322f] mb-2">Skills & Interests</h2>
              <p className="text-sm text-[#605A57] mb-4">Add up to 10 skills or interests</p>

              <div className="flex flex-wrap gap-2 mb-3">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-[#37322f]/10 text-[#37322f] rounded-full text-sm"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="hover:text-red-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleAddSkill}
                placeholder="Add a skill (press Enter)"
                disabled={skills.length >= 10}
                className="w-full border-2 border-[#E0DEDB] rounded-lg px-4 py-2.5 text-sm text-[#37322f] focus:outline-none focus:border-[#37322f] transition-colors disabled:opacity-50"
              />
            </div>

            {/* Submit Button (Mobile) */}
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-[#37322F] text-white px-4 py-3 rounded-lg font-medium hover:bg-[#4a443f] transition-colors disabled:opacity-50 sm:hidden"
            >
              {saved ? "Saved!" : saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </motion.div>
      </main>
    </div>
  )
}
