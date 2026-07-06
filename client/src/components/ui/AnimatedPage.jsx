import { motion } from 'framer-motion'
import { pageVariants } from '../../lib/motion'

/** Wraps a routed page with a smooth entrance transition. */
export default function AnimatedPage({ children, className }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className={className}
    >
      {children}
    </motion.div>
  )
}
