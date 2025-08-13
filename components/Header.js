import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white sticky top-0 z-50 shadow">
      <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between" dir="rtl">
        {/* منو — راست */}
        <nav className="order-2 flex items-center gap-6 text-[15px] md:text-[18px] lg:text-[19px] font-semibold text-gray-900">
          <Link href="/">خانه</Link>
          <Link href="/services">خدمات</Link>
          <Link href="/brands">برندها</Link>
          <Link href="/contact">تماس با ما</Link>
          <Link
            href="/tools"
            className="rounded-full border border-black/20 px-5 py-2.5 hover:bg-black/5"
          >
            ورود به ابزارها
          </Link>
        </nav>

        {/* لوگو — چپ */}
        <Link href="/" className="order-1 shrink-0">
          <img
            src="/logo-satrass.png?v=4"  /* فایل لوگو را در public/logo-satrass.png بگذار */
            alt="Satrass"
            className="h-16 lg:h-20 w-auto object-contain"
          />
        </Link>
      </div>
    </header>
  );
}