// components/Header.js
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white sticky top-0 z-50 shadow">
      <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between" dir="rtl">
        {/* منو (راست) */}
        <nav className="order-2 flex items-center gap-6 text-[15px] md:text-[17px] lg:text-[18px] font-semibold text-gray-900">
          <Link href="/">خانه</Link>
          <Link href="/tools">ابزارها</Link>
          <Link href="/services">راهکارها و نرم‌افزارها</Link>
          <Link href="/about">درباره ما</Link>
          <Link href="/contact">تماس با ما</Link>
        </nav>

        {/* لوگو (چپ) */}
        <Link href="/" className="order-1 shrink-0">
          <img
            src="/logo-satrass.png?v=4"
            alt="Satrass"
            className="h-16 lg:h-20 w-auto object-contain drop-shadow-sm"
          />
        </Link>
      </div>
    </header>
  );
}