export default function Tools() {
  const items = [
    {title: 'Unity MidrangeSizer', desc: 'محاسبه ظرفیت و پیکربندی بهینه برای سری Unity Midrange'},
    {title: 'PowerStore Configurator', desc: 'انتخاب و پیکربندی کامل مدل‌های PowerStore'},
    {title: 'Unity Configurator', desc: 'طراحی و انتخاب پیکربندی مناسب برای خانواده Unity XT'},
    {title: 'PowerStore RAID Calculator', desc: 'محاسبه ظرفیت و افزونگی آرایه‌های RAID در PowerStore'},
  ];
  return (
    <div className="min-h-screen font-sans">
        <div className="container flex justify-between items-center">
          <div className="text-xl font-bold text-brand.yellow">SATRASS</div>
          <a href="/" className="text-sm hover:text-brand.teal">بازگشت به خانه</a>
        </div>
      <main className="container p-8">
        <h1 className="text-2xl font-bold mb-6">ابزارها</h1>
        <div className="grid md:grid-cols-2 gap-6">
          {items.map((tool, i) => (
            <div key={i} className="p-4 border rounded-lg hover:shadow-md transition bg-white">
              <h3 className="font-bold mb-2">{tool.title}</h3>
              <p className="text-gray-600 text-sm">{tool.desc}</p>
              <button className="mt-4 bg-brand.teal text-white px-3 py-1 rounded">اجرا</button>
            </div>
          ))}
        </div>
      </main>
      <footer className="bg-black text-white">
        <div className="container p-6 text-center">
          <p>© 2025 ساتراس.</p>
        </div>
      </footer>
    </div>
  )
}
