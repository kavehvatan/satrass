// pages/tools.js
export default function Tools() {
  const tools = [
    {
      title: "PowerStore Configurator",
      desc: "انتخاب و پیکربندی کامل مدل‌های PowerStore",
      img: "/avatars/dell.png",
      href: "#",
    },
    {
      title: "Unity MidrangeSizer",
      desc: "محاسبه ظرفیت و پیکربندی بهینه برای سری Unity Midrange",
      img: "/avatars/dell.png",
      href: "#",
    },
    {
      title: "PowerStore RAID Calculator",
      desc: "محاسبه ظرفیت و افزونگی آرایه‌های RAID در PowerStore",
      img: "/avatars/dell.png",
      href: "#",
    },
    {
      title: "Unity Configurator",
      desc: "طراحی و انتخاب پیکربندی مناسب برای خانواده Unity XT",
      img: "/avatars/dell.png",
      href: "#",
    },
  ];

  return (
    <main className="min-h-screen">
      <section className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-extrabold mb-8">ابزارها</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {tools.map((t, i) => (
            <article
              key={i}
              className="flex items-center gap-6 border rounded-2xl p-6 shadow-sm hover:shadow-md transition"
            >
              {/* تصویر ابزار */}
              <div className="shrink-0">
                <img
                  src={t.img}
                  alt={t.title}
                  className="w-20 h-20 object-contain"
                  onError={(e) => (e.currentTarget.src = "/avatars/default.png")}
                />
              </div>

              {/* متن + دکمه‌ها */}
              <div className="grow">
                <h2 className="text-xl font-bold">{t.title}</h2>
                <p className="mt-2 text-gray-600">{t.desc}</p>

                <div className="mt-4 flex gap-3">
                  <a
                    href={t.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block rounded-full px-4 py-2 font-semibold bg-amber-400 text-black hover:bg-amber-300 transition"
                  >
                    باز کردن ابزار
                  </a>

                  <a
                    href="#"
                    className="inline-block rounded-full px-4 py-2 font-semibold border border-amber-400 text-amber-600 hover:bg-amber-50 transition"
                  >
                    راهنما
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}