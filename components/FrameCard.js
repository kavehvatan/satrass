// components/FrameCard.jsx
import Link from "next/link";

export default function FrameCard({
  title,
  logo = "",
  summary = "",
  ctas = [], // [{label, href, tone:'primary'|'outline', disabled?:bool}]
  className = "",
}) {
  return (
    <div
      className={`group relative rounded-3xl p-[1.5px] bg-gradient-to-br from-amber-400/70 via-amber-300/25 to-transparent hover:from-amber-400/90 hover:via-amber-300/40 transition ${className}`}
    >
      <div className="rounded-3xl bg-white/60 dark:bg-slate-900/70 backdrop-blur-lg shadow-xl p-5 h-full">
        <div className="flex items-center gap-4 mb-3">
          {logo ? (
            <img
              src={logo}
              alt={title}
              className="w-12 h-12 object-contain"
              onError={(e) => (e.currentTarget.src = "/avatars/default.png")}
            />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-slate-700/50" />
          )}
          <h3 className="font-bold text-slate-900 dark:text-white">{title}</h3>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-200 min-h-[3.5rem]">
          {summary || "برای مشاهدهٔ جزئیات کلیک کنید."}
        </p>

        {ctas?.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-3">
            {ctas.map((btn, i) => {
              const base = "inline-flex items-center rounded-2xl px-5 py-3 transition";
              if (btn.tone === "outline") {
                return (
                  <Link
                    key={i}
                    href={btn.href || "#"}
                    prefetch={false}
                    className={`${base} border-2 border-amber-400 text-amber-400 hover:bg-amber-50/10 ${btn.disabled ? "pointer-events-none opacity-60" : ""}`}
                  >
                    {btn.label}
                  </Link>
                );
              }
              // primary
              return (
                <Link
                  key={i}
                  href={btn.href || "#"}
                  prefetch={false}
                  className={`${base} bg-teal-500 hover:bg-teal-600 text-white ${btn.disabled ? "pointer-events-none opacity-60" : ""}`}
                >
                  {btn.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}