// pages/services/install.js
export default function Install() {
   return (
    <div className="max-w-4xl mx-auto py-12 px-4 text-center">
      <h1 className="text-3xl font-bold mb-6">نصب و راه‌اندازی</h1>
      <p className="text-lg leading-8 text-gray-700 mb-12 text-right">
        خدمات نصب و راه‌اندازی ما شامل آماده‌سازی کامل زیرساخت، استقرار تجهیزات و
        پیکربندی استاندارد مطابق با بهترین روش‌های جهانی است. همچنین در صورت نیاز،
        فرآیند مهاجرت داده‌ها بدون قطعی انجام می‌شود و در پایان، تست‌های لازم برای
        اطمینان از عملکرد صحیح سیستم صورت می‌گیرد.
      </p>

      {/* آواتار نصب و راه‌اندازی */}
      <div className="flex justify-center mt-10">
        <img
          src="/avatars/install.webp"
          alt="Install Avatar"
          className="w-[300px] h-auto shadow-md object-contain"
        />
      </div>
    </div>
  );
}