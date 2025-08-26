export default function ConsultingDesign() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 text-center">
      <h1 className="text-3xl font-bold mb-6">پایش</h1>
      <p className="text-lg leading-8 text-gray-700 mb-12 text-right">
        مشاوره و طراحی دقیق زیرساخت‌های فناوری اطلاعات، سنگ‌بنای موفقیت در پروژه‌های
        سازمانی است. در این سرویس، ما نیازسنجی کامل انجام داده و بر اساس ظرفیت، رشد آینده،
        الزامات امنیتی و اهداف کسب‌وکار، طرحی جامع شامل دیاگرام‌ها، BOM و مسیر مهاجرت
        ارائه می‌کنیم. هدف ما ارائه چندین گزینهٔ فنی و مالی است تا تصمیم‌گیری برای شما
        شفاف‌تر و مطمئن‌تر باشد.
      </p>

      {/* آواتار مشاوره و طراحی */}
      <div className="flex justify-center mt-10">
        <img
          src="/avatars/consulting-design.webp"
          alt="Consulting & Design Avatar"
          className="w-56 h-56 rounded-full shadow-md object-cover"
        />
      </div>
    </div>
  );
}