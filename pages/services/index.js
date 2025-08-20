// pages/services/index.js
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import solutions from "../../data/solutions.json"; // ایمپورت نسبی، مطمئن

const BRAND_COLORS = ["#00E5FF", "#2D5BFF"]; // دو رنگ لوگو (در صورت تفاوت، عوضش کن)
const pick = (i) => BRAND_COLORS[i % BRAND_COLORS.length];

export default function Services() {
  return (
    <>
      <Head>
        <title>راهکارها و نرم‌افزارها | ساتراس</title>
        <meta name="description" content="فهرست راهکارها و نرم‌افزارهای ساتراس." />
      </Head>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-8">
          راهکارها و نرم‌افزارها
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {solutions.items.map((item, idx) => (
            <Link key={item.title} href={item.url || "#"} className="group">
              <div
                className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-5 transition-transform duration-200 group-hover:-translate-y-1"
              >
                {/* هاله‌ی رنگی شیشه‌ای با یکی از دو رنگ لوگو (نه هر دو همزمان) */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-30"
                  style={{
                    background: `radial-gradient(120% 120% at 0% 0%, ${pick(
                      idx
                    )}22, transparent 60%)`,
                  }}
                />
                <div className="relative flex items-center gap-4">
                  <div className="w-12 h-12 shrink-0 rounded-lg bg-black/30 flex items-center justify-center overflow-hidden">
                    {item.logo ? (
                      <Image
                        src={item.logo}
                        alt={item.title}
                        width={48}
                        height={48}
                        priority={false}
                      />
                    ) : (
                      <span className="text-white/60 text-sm">
                        {item.title[0]}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-white font-semibold">{item.title}</h3>
                    {item.desc && (
                      <p className="text-white/70 text-sm line-clamp-2 mt-1">
                        {item.desc}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}