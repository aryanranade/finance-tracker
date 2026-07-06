import { useEffect, useRef } from 'react'
import { useMotionValue, useSpring, useInView } from 'framer-motion'

/**
 * Animated number that springs from 0 (or its previous value) to `value`.
 * Formats via the `format` prop (defaults to plain rounding).
 */
export default function CountUp({ value = 0, format, duration = 1.1, className }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const motionVal = useMotionValue(0)
  const spring = useSpring(motionVal, {
    duration: duration * 1000,
    bounce: 0,
  })

  useEffect(() => {
    if (inView) motionVal.set(value)
  }, [inView, value, motionVal])

  useEffect(() => {
    const fmt = format || ((v) => Math.round(v).toLocaleString())
    const unsub = spring.on('change', (v) => {
      if (ref.current) ref.current.textContent = fmt(v)
    })
    return unsub
  }, [spring, format])

  // Render the final value for SSR / reduced-motion fallback
  const fmt = format || ((v) => Math.round(v).toLocaleString())
  return (
    <span ref={ref} className={className}>
      {fmt(0)}
    </span>
  )
}
