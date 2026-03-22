export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[65vh]">
      <div className="flex flex-col items-center gap-3">
        {/* Wordmark breathes in and out */}
        <span
          className="text-[2.5rem] text-[#37322f] select-none log-loading-wordmark"
          style={{ fontFamily: 'var(--font-serif), serif' }}
        >
          log.
        </span>

        {/* Thin sweeping highlight bar */}
        <div className="w-10 h-px bg-[#37322f]/10 relative overflow-hidden">
          <div className="log-loading-sweep absolute inset-0" />
        </div>
      </div>
    </div>
  )
}
