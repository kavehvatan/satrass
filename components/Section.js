// components/Section.js
export default function Section({ id, title, subtitle, children, className = "" }) {
  return (
    <section id={id} className={`max-w-6xl mx-auto px-4 ${className}`}>
      <header className="mb-6">
        <h2 className="text-2xl md:text-3xl font-extrabold">{title}</h2>
        {subtitle ? <p className="mt-2 text-gray-600">{subtitle}</p> : null}
      </header>
      {children}
    </section>
  );
}