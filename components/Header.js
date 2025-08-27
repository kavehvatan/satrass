// components/Header.js
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

const TEAL = "#14b8a6";
const YELLOW = "#f4c21f";

export default function Header() {
  const router = useRouter();

  const nav = [
    { href: "/", label: "خانه" },
    { href: "/tools", label: "ابزارها" },
    { href: "/about", label: "درباره ما" },
    { href: "/contact", label: "تماس با ما" },
  ];

  const isActive = (href) =>
    href === "/" ? router.pathname === href : router.pathname.startsWith(href);

  const itemClass =
    "relative text-sm font-semibold transition hover:text-teal-600";
  const activeClass = "text-teal-600";

  // ✨ تغییر جدید: رنگ متناوب برای «ابزارها»
  const [toolsColor, setToolsColor] = useState(TEAL);
  useEffect(() => {
    const id = setInterval(() => {
      setToolsColor((c) => (c === TEAL ? YELLOW : TEAL));
    }, 1000); // هر ثانیه
    return () => clearInterval(id);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* لوگو */}
        <Link href="/" className="flex items-center gap-2">
          <img
            src="/logo-satrass.png"
            alt="Satrass"
            className="w-8 h-8 object-contain"
          />
          <span className="font-extrabold text-slate-900">ساتراس</span>
        </Link>

        {/* منو دسکتاپ */}
        <nav className="hidden md:flex items-center gap-7 text-slate-900">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`${itemClass} ${isActive(n.href) ? activeClass : ""}`}
              aria-current={isActive(n.href) ? "page" : undefined}
              // ⬇️ فقط برای «ابزارها» رنگ متناوب اعمال شود
              style={n.href === "/tools" ? { color: toolsColor } : undefined}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        {/* منو موبایل (اختیاری) */}
        <div className="md:hidden">
          {/* اگر بعداً نیاز داشتی، اینجا دکمه‌ی منو موبایل اضافه میشه */}
        </div>
      </div>
    </header>
  );
}