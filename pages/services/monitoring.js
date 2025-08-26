export default function Monitoring() {
  return (
    <div className="max-w-4xl mx-auto py-12 text-center">
      <h1 className="text-3xl font-bold mb-6">پایش</h1>
      <p className="text-lg leading-8 text-gray-700 mb-12 text-right">
        پایش مداوم زیرساخت‌های ذخیره‌سازی و شبکه نقش مهمی در پیشگیری از خرابی‌ها و کاهش زمان
        قطعی دارد. در این بخش، تیم ما با ابزارهای پیشرفته وضعیت سیستم‌ها را بررسی کرده،
        مشکلات احتمالی را شناسایی و پیش از بروز بحران اقدام به رفع آن‌ها می‌کند. این سرویس
        به شما اطمینان خاطر می‌دهد که تجهیزاتتان همواره در بهترین وضعیت عملیاتی باقی می‌مانند.
      </p>

      {/* آواتار پایش */}
      <div className="flex justify-center mt-10">
        <img
          src="/avatars/monitoring.webp"
          alt="Monitoring Avatar"
          className="w-56 h-56 rounded-full shadow-md object-cover"
        />
      </div>
    </div>
  );
}