import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Check } from 'lucide-react'

/**
 * Custom animated dropdown — replaces native <select>.
 * options: [{ value, label, icon?, color? }]
 * Keyboard: ArrowUp/Down to navigate, Enter to pick, Escape to close.
 */
export default function Select({ value, onChange, options, placeholder = 'Select...', error, id }) {
  const [open, setOpen] = useState(false)
  const [highlighted, setHighlighted] = useState(-1)
  const [dropUp, setDropUp] = useState(false)
  const rootRef = useRef(null)

  const selected = options.find(o => o.value === value)

  const close = useCallback(() => {
    setOpen(false)
    setHighlighted(-1)
  }, [])

  // Open, flipping upward when there isn't enough room below (e.g. bottom of a modal)
  const MENU_MAX = 240 // max-h-56 + margin
  const toggleOpen = () => {
    if (!open && rootRef.current) {
      const rect = rootRef.current.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom
      setDropUp(spaceBelow < MENU_MAX && rect.top > spaceBelow)
    }
    setOpen(o => !o)
  }

  // Outside click
  useEffect(() => {
    if (!open) return
    const onClick = (e) => {
      if (!rootRef.current?.contains(e.target)) close()
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [open, close])


  const onKeyDown = (e) => {
    if (e.key === 'Escape') { close(); return }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (!open) { toggleOpen(); return }
      setHighlighted(h => Math.min(h + 1, options.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlighted(h => Math.max(h - 1, 0))
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (!open) { toggleOpen(); return }
      if (highlighted >= 0) {
        onChange(options[highlighted].value)
        close()
      }
    }
  }

  return (
    <div className="relative" ref={rootRef}>
      <button
        id={id}
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={toggleOpen}
        onKeyDown={onKeyDown}
        className={`form-input flex items-center justify-between gap-2 text-left cursor-pointer select-none
          ${error ? 'form-input-error' : ''}
          ${open ? 'border-primary-500 ring-2 ring-primary-500/30' : ''}`}
      >
        <span className={`flex items-center gap-2.5 truncate ${selected ? 'text-white' : 'text-slate-500'}`}>
          {selected?.icon && <span className="text-base leading-none">{selected.icon}</span>}
          {selected?.color && (
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: selected.color }} />
          )}
          {selected?.label || placeholder}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-slate-500 flex-shrink-0"
        >
          <ChevronDown size={16} />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: dropUp ? 6 : -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: dropUp ? 4 : -4, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className={`absolute z-50 w-full max-h-56 overflow-y-auto rounded-xl p-1.5
                        border border-white/10 shadow-card-lg
                        ${dropUp ? 'bottom-full mb-2 origin-bottom' : 'top-full mt-2 origin-top'}`}
            style={{
              background: 'rgba(15, 15, 18, 0.97)',
              backdropFilter: 'blur(20px) saturate(150%)',
            }}
          >
            {options.map((opt, i) => {
              const isSelected = opt.value === value
              const isHighlighted = i === highlighted
              return (
                <li
                  key={opt.value}
                  role="option"
                  aria-selected={isSelected}
                  ref={isHighlighted ? (el) => el?.scrollIntoView({ block: 'nearest' }) : undefined}
                  onMouseEnter={() => setHighlighted(i)}
                  onClick={() => { onChange(opt.value); close() }}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors duration-100
                    ${isHighlighted ? 'bg-white/[0.07] text-white' : 'text-slate-300'}
                    ${isSelected ? 'text-primary-300' : ''}`}
                >
                  {opt.icon && <span className="text-base leading-none">{opt.icon}</span>}
                  {opt.color && (
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: opt.color }} />
                  )}
                  <span className="flex-1 truncate">{opt.label}</span>
                  {isSelected && <Check size={14} className="text-primary-400 flex-shrink-0" />}
                </li>
              )
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
