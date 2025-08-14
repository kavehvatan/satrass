export default function UnityMidrangeSizer() {
  return (
    <main dir="rtl" className="min-h-screen bg-slate-900 text-right">
      <section className="container mx-auto px-4 py-8 md:py-10">
        <h1 className="text-white text-2xl md:text-3xl font-extrabold mb-4">
          Unity MidrangeSizer
        </h1>

        <p className="text-slate-300 mb-6">
          نسخهٔ میزبانی‌شده‌ی Unity MidrangeSizer روی سرور شما.
        </p>

        <div className="rounded-2xl overflow-hidden shadow-xl ring-1 ring-black/10 bg-black/20">
          <iframe
            src="https://unitycalculator.onrender.com/"
            title="Unity MidrangeSizer"
            className="w-full"
            style={{ height: "85vh", border: 0 }}
          />
        </div>
      </section>
    </main>
  );
}