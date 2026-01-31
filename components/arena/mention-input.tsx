"use client"

import { useState, useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from "react"
import { createClient } from "@/lib/supabase/client"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2 } from "lucide-react"

interface Profile {
  id: string
  username: string
  full_name: string | null
  avatar_url: string | null
}

interface MentionInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
  className?: string
  autoFocus?: boolean
}

export interface MentionInputRef {
  focus: () => void
}

export const MentionInput = forwardRef<MentionInputRef, MentionInputProps>(
  ({ value, onChange, placeholder, rows = 2, className = "", autoFocus = false }, ref) => {
    const supabase = createClient()
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [suggestions, setSuggestions] = useState<Profile[]>([])
    const [loading, setLoading] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [mentionStart, setMentionStart] = useState<number | null>(null)
    const [mentionQuery, setMentionQuery] = useState("")

    useImperativeHandle(ref, () => ({
      focus: () => textareaRef.current?.focus(),
    }))

    const searchUsers = useCallback(
      async (query: string) => {
        if (query.length < 1) {
          setSuggestions([])
          return
        }

        setLoading(true)
        const { data } = await (supabase.from("profiles") as any)
          .select("id, username, full_name, avatar_url")
          .or(`username.ilike.%${query}%,full_name.ilike.%${query}%`)
          .limit(5)

        if (data) {
          setSuggestions(data)
        }
        setLoading(false)
      },
      [supabase]
    )

    useEffect(() => {
      const debounceTimer = setTimeout(() => {
        if (mentionQuery) {
          searchUsers(mentionQuery)
        }
      }, 200)

      return () => clearTimeout(debounceTimer)
    }, [mentionQuery, searchUsers])

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value
      const cursorPos = e.target.selectionStart

      onChange(newValue)

      // Check if we're in a mention context
      const textBeforeCursor = newValue.slice(0, cursorPos)
      const lastAtSymbol = textBeforeCursor.lastIndexOf("@")

      if (lastAtSymbol !== -1) {
        const textAfterAt = textBeforeCursor.slice(lastAtSymbol + 1)
        // Check if there's a space or newline between @ and cursor
        if (!/\s/.test(textAfterAt)) {
          setMentionStart(lastAtSymbol)
          setMentionQuery(textAfterAt)
          setShowSuggestions(true)
          setSelectedIndex(0)
          return
        }
      }

      setShowSuggestions(false)
      setMentionStart(null)
      setMentionQuery("")
    }

    const insertMention = (profile: Profile) => {
      if (mentionStart === null) return

      const textarea = textareaRef.current
      if (!textarea) return

      const beforeMention = value.slice(0, mentionStart)
      const afterMention = value.slice(textarea.selectionStart)
      const newValue = `${beforeMention}@${profile.username} ${afterMention}`

      onChange(newValue)
      setShowSuggestions(false)
      setMentionStart(null)
      setMentionQuery("")

      // Set cursor position after the mention
      requestAnimationFrame(() => {
        const newCursorPos = mentionStart + profile.username.length + 2
        textarea.setSelectionRange(newCursorPos, newCursorPos)
        textarea.focus()
      })
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (!showSuggestions || suggestions.length === 0) return

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          setSelectedIndex((prev) => (prev + 1) % suggestions.length)
          break
        case "ArrowUp":
          e.preventDefault()
          setSelectedIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length)
          break
        case "Enter":
          if (showSuggestions && suggestions[selectedIndex]) {
            e.preventDefault()
            insertMention(suggestions[selectedIndex])
          }
          break
        case "Escape":
          setShowSuggestions(false)
          break
        case "Tab":
          if (showSuggestions && suggestions[selectedIndex]) {
            e.preventDefault()
            insertMention(suggestions[selectedIndex])
          }
          break
      }
    }

    return (
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={rows}
          autoFocus={autoFocus}
          className={className}
          onBlur={() => {
            // Delay hiding to allow click on suggestion
            setTimeout(() => setShowSuggestions(false), 150)
          }}
        />

        <AnimatePresence>
          {showSuggestions && (mentionQuery.length > 0 || loading) && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 bottom-full mb-1 w-64 bg-white rounded-xl shadow-lg border border-[#E0DEDB]/60 overflow-hidden z-50"
            >
              {loading ? (
                <div className="p-3 flex items-center justify-center">
                  <Loader2 className="w-4 h-4 animate-spin text-[#9C9894]" />
                </div>
              ) : suggestions.length === 0 ? (
                <div className="p-3 text-sm text-[#9C9894] text-center">
                  No users found
                </div>
              ) : (
                <div className="py-1">
                  {suggestions.map((profile, index) => (
                    <button
                      key={profile.id}
                      type="button"
                      onClick={() => insertMention(profile)}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-left transition-colors ${
                        index === selectedIndex ? "bg-[#f7f5f3]" : "hover:bg-[#f7f5f3]"
                      }`}
                    >
                      <div className="w-6 h-6 rounded-full bg-[#37322f] text-white flex items-center justify-center text-xs font-medium overflow-hidden flex-shrink-0">
                        {profile.avatar_url ? (
                          <img
                            src={profile.avatar_url}
                            alt={profile.username}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          (profile.full_name?.[0] || profile.username[0]).toUpperCase()
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[#37322f] truncate">
                          {profile.full_name || profile.username}
                        </p>
                        <p className="text-xs text-[#9C9894] truncate">@{profile.username}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }
)

MentionInput.displayName = "MentionInput"

// Utility function to extract mentions from content
export function extractMentions(content: string): string[] {
  const mentionRegex = /@(\w+)/g
  const mentions: string[] = []
  let match

  while ((match = mentionRegex.exec(content)) !== null) {
    mentions.push(match[1])
  }

  return [...new Set(mentions)]
}

// Utility function to render content with linked mentions
export function renderContentWithMentions(content: string): React.ReactNode {
  const parts = content.split(/(@\w+)/g)

  return parts.map((part, index) => {
    if (part.startsWith("@")) {
      const username = part.slice(1)
      return (
        <a
          key={index}
          href={`/arena/profile/${username}`}
          className="text-[#37322f] font-medium hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          {part}
        </a>
      )
    }
    return part
  })
}
