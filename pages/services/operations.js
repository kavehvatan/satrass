export default function Operations() {
return (
    <div className="max-w-4xl mx-auto py-12 px-4 text-center">
      <h1 className="text-3xl font-bold mb-6">راهبری</h1>
      <p className="text-lg leading-8 text-gray-700 mb-12 text-justify text-center">
        راهبری (Managed Services) به معنای سپردن مدیریت روزانه‌ی زیرساخت به تیم متخصص است.
        ما در این سرویس وظایفی مانند پچینگ، بررسی لاگ‌ها، هاردنینگ امنیتی، صحت‌سنجی بکاپ‌ها
        و رسیدگی به رخدادها را طبق SLA بر عهده می‌گیریم. همچنین گزارش‌های ماهانه از وضعیت
        سلامت، ظرفیت و ریسک‌های احتمالی ارائه می‌شود تا تصمیم‌گیری‌های مدیریتی ساده‌تر شود.
      </p>

      {/* آواتار راهبری */}
      <div className="flex justify-center mt-10">
        <img
          src="/avatars/operations.webp"
          alt="Operations Avatar"
          className="w-56 h-56 rounded-full shadow-md object-cover"
        />
      </div>
    </div>
  );
}