// components/FrameCard.jsx
export default function FrameCard({ className = "", children }) {
  return (
    <div
      className="
        group p-[1.2px] rounded-2xl
        bg-gradient-to-br from-amber-400/60 via-teal-400/60 to-sky-500/60
        shadow-[0_0_0_1px_rgba(0,0,0,.02)]
        hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,.25)]
        transition
      "
    >
      <div
        className={`
          rounded-2xl
          bg-white/80 dark:bg-slate-900/70
          backdrop-blur supports-[backdrop-filter]:bg-white/60
          ring-1 ring-slate-200/70 dark:ring-slate-700/60
          ${className}
        `}
      >
        {children}
      </div>
    </div>
  );
}
