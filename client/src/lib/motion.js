// Shared Framer Motion variants — balanced & tasteful.
// Durations 0.3–0.5s, ease-out, subtle staggers.

export const EASE = [0.22, 1, 0.36, 1] // easeOutExpo-ish

export const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: EASE },
  },
}

export const staggerContainer = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
}

export const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: EASE },
  },
}

export const scaleIn = {
  initial: { opacity: 0, scale: 0.96 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: EASE },
  },
}

export const springModal = {
  initial: { opacity: 0, scale: 0.94, y: 16 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 380, damping: 30 },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 10,
    transition: { duration: 0.18 },
  },
}

export const overlayFade = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
}

// Subtle hover lift for interactive cards (use with whileHover)
export const hoverLift = {
  y: -3,
  transition: { duration: 0.2, ease: 'easeOut' },
}
