import { motion } from 'framer-motion'
import { scaleIn } from '../../lib/motion'

/**
 * Friendly empty state with an icon, message and optional CTA.
 * Usage: <EmptyState icon={Inbox} title="No transactions yet" action={<button.../>} />
 */
export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <motion.div
      variants={scaleIn}
      initial="initial"
      animate="animate"
      className="flex flex-col items-center justify-center text-center py-14 px-6"
    >
      {Icon && (
        <div className="relative mb-5">
          <div className="absolute inset-0 rounded-full bg-primary-500/20 blur-2xl scale-150" />
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-surface-600 to-surface-700 border border-border-light/40 flex items-center justify-center shadow-inner-highlight animate-float">
            <Icon size={28} className="text-primary-300" />
          </div>
        </div>
      )}
      <h3 className="text-base font-bold text-white">{title}</h3>
      {description && (
        <p className="text-sm text-slate-500 mt-1.5 max-w-sm">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </motion.div>
  )
}
