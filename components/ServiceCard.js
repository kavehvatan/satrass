// components/ServiceCard.jsx
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

function slugify(s) {
  return s
    .toString()
    .trim()
    .replace(/\u200c/g, "")
    .replace(/[^\w\u0600-\u06FF\- ]+/g, "")
    .replace(/\s+/g, "-");
}

export default function ServiceCard({ title, icon, description, href }) {
  // روی موبایل/تاچ → کلیک‌فلیپ. روی دسکتاپ → Hover
  const [useClickFlip, setUseClickFlip] = useState(false);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: none), (pointer: coarse)");
    const apply = () => setUseClickFlip(mq.matches);
    apply();
    try { mq.addEventListener("change", apply); } catch { mq.addListener(apply); }
    return () => {
      try { mq.removeEventListener("change", apply); } catch { mq.removeListener(apply); }
    };
  }, []);

  const to = href || `/services/${slugify(title)}`;

  return (
    <button
      type="button"
      onClick={useClickFlip ? () => setFlipped((s) => !s) : undefined}
      aria-label={title}
      className="relative w-full text-right focus:outline-none"
    >
      <div
        className={`scard hoverable relative h-48 rounded-3xl border border-slate-200/60
                    bg-white/70 dark:bg-slate-900/30 backdrop-blur-md
                    ring-1 ring-black/[0.03] transition-transform duration-500
                    ${useClickFlip && flipped ? "scard-flipped" : ""}`}
      >
        {/* روی کارت */}
        <div className="scard-face scard-front absolute inset-0 rounded-3xl flex items-center gap-6 px-8">
          <span
            className="shrink-0 inline-flex items-center justify-center
                       w-20 h-20 rounded-2xl bg-white/80 ring-1 ring-black/5
                       shadow-[inset_0_0_0_1px_rgba(0,0,0,0.03)]"
          >
            <Image
              src={icon}
              alt=""
              width={64}
              height={64}
              className="object-contain"
              priority={false}
            />
          </span>
          <h3 className="text-2xl font-extrabold text-slate-900/90 dark:text-white">
            {title}
          </h3>
        </div>

        {/* پشت کارت */}
        <div className="scard-face scard-back absolute inset-0 rounded-3xl p-6 flex flex-col justify-between">
          <p className="text-slate-700 leading-8 dark:text-slate-200">
            {description}
          </p>

          <div className="mt-4">
            <Link
              href={to}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2
                         bg-teal-500 text-white hover:bg-teal-600
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-400
                         transition"
            >
              اطلاعات بیشتر
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="rtl:rotate-180">
                <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </button>
  );
}