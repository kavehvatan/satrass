export default function Training() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 text-center">
      <h1 className="text-3xl font-bold mb-6">پایش</h1>
      <p className="text-lg leading-8 text-gray-700 mb-12 text-right">
        آموزش تخصصی زیرساخت، تنها به انتقال اطلاعات محدود نمی‌شود؛ بلکه تجربهٔ عملی و سناریوهای
        واقعی را در اختیار تیم شما قرار می‌دهد. در این بخش، کارشناسان ما با ارائهٔ دوره‌های
        تعاملی و Runbook اختصاصی، توانایی راهبری، نگهداری و عیب‌یابی سیستم‌ها را به شما منتقل
        می‌کنند. پس از پایان دوره نیز، پشتیبانی پرسش‌وپاسخ و به‌روزرسانی منابع آموزشی ادامه دارد.
      </p>

      {/* آواتار آموزش */}
      <div className="flex justify-center mt-10">
        <img
          src="/avatars/training.webp"
          alt="Training Avatar"
          className="w-56 h-56 rounded-full shadow-md object-cover"
        />
      </div>
    </div>
  );
}