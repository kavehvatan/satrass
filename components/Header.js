// components/Header.js
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between" dir="rtl">
        {/* ناوبری (راست) */}
        <nav className="order-2 flex items-center gap-6 text-[15px] md:text-[17px] lg:text-[18px] font-semibold text-gray-900">
          <Link href="/" className="hover:text-black/70">خانه</Link>
          <Link href="/tools" className="hover:text-black/70">ابزارها</Link>
          <Link href="/about" className="hover:text-black/70">درباره ما</Link>
          <Link href="/contact" className="hover:text-black/70">تماس با ما</Link>
        </nav>

        {/* لوگو (چپ) */}
        <Link href="/" className="order-1 shrink-0" aria-label="Satrass">
          <img
            src="/logo-satrass.png?v=4"
            alt="Satrass"
            className="h-16 lg:h-20 w-auto object-contain"
          />
        </Link>
      </div>
    </header>
  );
}