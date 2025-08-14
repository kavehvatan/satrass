// components/GlassModal.js
import { useEffect, useState } from "react";

export default function GlassModal({
  open,
  onClose,
  title,
  paragraphs = [],
  variant = "neutral", // "neutral" | "tint"
  accent = "#14b8a6",   // وقتی variant = "tint" است
}) {
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && handleClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => (document.body.style.overflow = prev);
    }
  }, [open]);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose?.();
    }, 200);
  };

  if (!open) return null;

  const tintBg =
    variant === "tint"
      ? { backgroundColor: toRgba(accent, 0.22) }
      : null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-200 ${
        closing ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />

      <article
        role="dialog"
        aria-modal="true"
        className={`relative z-10 w-[min(92vw,760px)] mx-auto rounded-2xl overflow-hidden transform transition-all duration-200 ${
          closing ? "opacity-0 scale-95" : "opacity-100 scale-100"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* لایه رنگی در صورت نیاز */}
        {variant === "tint" && <div className="absolute inset-0" style={tintBg} />}

        {/* بدنه شیشه‌ای */}
        <div
          className={`relative rounded-2xl border backdrop-blur-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,.5)]
            ${variant === "tint" ? "border-white/15 bg-white/10" : "border-black/10 bg-white/85"}`}
        >
          <div className="p-6 md:p-8">
            <div className="flex items-start justify-between gap-6">
              <h4
                className={`text-xl md:text-2xl font-extrabold ${
                  variant === "tint" ? "text-white" : "text-gray-900"
                }`}
              >
                {title}
              </h4>
              <button
                onClick={handleClose}
                aria-label="بستن"
                className={`text-2xl leading-none transition ${
                  variant === "tint" ? "text-white/85 hover:text-white" : "text-gray-700 hover:text-black"
                }`}
              >
                ×
              </button>
            </div>

            {paragraphs.map((tx, i) => (
              <p
                key={i}
                className={`leading-8 ${i === 0 ? "mt-4" : "mt-3"} ${
                  variant === "tint" ? "text-white/90" : "text-gray-800"
                }`}
              >
                {tx}
              </p>
            ))}

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleClose}
                className={`px-4 py-2 rounded-lg transition ${
                  variant === "tint"
                    ? "bg-white/15 hover:bg-white/25 text-white"
                    : "border border-black/10 hover:bg-black/[0.03]"
                }`}
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

function toRgba(hex, alpha = 1) {
  const c = hex.replace("#", "");
  const bigint = parseInt(c, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}