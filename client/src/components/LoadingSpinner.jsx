export default function LoadingSpinner({ size = 'md', text }) {
  const sizes = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-[3px]',
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <div
        className={`rounded-full border-primary-500 border-t-transparent animate-spin ${sizes[size]}`}
        style={{ borderStyle: 'solid' }}
      />
      {text && <p className="text-sm text-slate-500">{text}</p>}
    </div>
  )
}
