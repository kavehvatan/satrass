// pages/tools.js
export default function Tools() {
  const tools = [
    {
      title: "PowerStore Configurator",
      desc: "انتخاب و پیکربندی کامل مدل‌های PowerStore",
      href: "#", // ← لینک واقعی ابزار رو بذار
    },
    {
      title: "Unity MidrangeSizer",
      desc: "محاسبه ظرفیت و پیکربندی بهینه برای سری Unity Midrange",
      href: "#",
    },
    {
      title: "PowerStore RAID Calculator",
      desc: "محاسبه ظرفیت و افزونگی آرایه‌های RAID در PowerStore",
      href: "#",
    },
    {
      title: "Unity Configurator",
      desc: "طراحی و انتخاب پیکربندی مناسب برای خانواده Unity XT",
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
              className="border rounded-2xl p-6 shadow-sm hover:shadow-md transition"
            >
              <h2 className="text-xl font-bold">{t.title}</h2>
              <p className="mt-2 text-gray-600">{t.desc}</p>

              <div className="mt-5">
                <a
                  href={t.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block rounded-full px-4 py-2.5 font-semibold bg-amber-400 text-black hover:bg-amber-300 transition"
                >
                  باز کردن ابزار
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}