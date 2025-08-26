export default function ConsultingDesign() {
  return (
    <div className="max-w-4xl mx-auto py-12 text-center">
      <h1 className="text-3xl font-bold mb-6">مشاوره و طراحی</h1>
      <p className="text-lg leading-8 text-gray-700 mb-12 text-justify">
        مشاوره و طراحی راهکارها بر اساس نیاز واقعی سازمان شما انجام می‌شود. 
        ما با تحلیل ظرفیت، سنجش ریسک و در نظر گرفتن رشد آینده، طرح‌های فنی و مالی شفافی ارائه می‌دهیم 
        تا تصمیم‌گیری مطمئن داشته باشید.
      </p>

      <div className="flex justify-center mt-10">
        <img
          src="/avatars/consulting-design.webp"
          alt="Consulting Design Avatar"
          className="w-48 h-48 rounded-full shadow-md object-cover"
        />
      </div>
    </div>
  );
}