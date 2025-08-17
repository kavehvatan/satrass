// pages/services/index.js
import { useState } from "react";
import Head from "next/head";
import Link from "next/link";

// مسیر نسبی (نه '@/')
import FrameCard from "../../components/FrameCard";
import solutions from "../../data/solutions.json";

/* مودال ساده برای نمایش جزئیات */
function GlassModal({ open, onClose, title, paragraphs = [] }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="mx-4 w-full max-w-3xl rounded-2xl bg-white/10 backdrop-blur-xl shadow-2xl ring-1 ring-white/20 p-6 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">{title}</h3>
          <button
            aria-label="بستن"
            onClick={onClose}
            className="rounded-lg px-3 py-1 bg-white/20 hover:bg-white/30 transition"
          >
            ×
          </button>
        </div>
        <div className="space-y-4 leading-8 text-slate-100">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <div className="mt-6 flex gap-3">
          <Link
            href="/contact#contact"
            className="inline-flex items-center rounded-2xl px-5 py-3 bg-teal-500 hover:bg-teal-600 text-white transition"
          >
            درخواست مشاوره
          </Link>
          <Link
            href="/tools"
            className="inline-flex items-center rounded-2xl px-5 py-3 border-2 border-amber-400 text-amber-400 hover:bg-amber-50/10 transition"
          >
            مشاهده ابزارها
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ServicesPage() {
  const { solutions: solutionItems = [], services: serviceItems = [] } = solutions || {};
  const all = [
    ...solutionItems.map((x) => ({ ...x, group: "solution" })),
    ...serviceItems.map((x) => ({ ...x, group: "service" })),
  ];

  const [open, setOpen] = useState(false);
  const [modal, setModal] = useState({ title: "", paragraphs: [] });

  const openModal = (item) => {
    setModal({ title: item.title, paragraphs: item.paragraphs || [] });
    setOpen(true);
  };

  return (
    <>
      <Head>
        <title>راهکارها و خدمات | ساتراس</title>
        <meta name="description" content="راهکارها، نرم‌افزارها و خدمات ساتراس" />
      </Head>

      <section className="bg-slate-900 text-white">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold">راهکارها و خدمات</h1>
          <p className="mt-3 text-slate-200">
            مجموعه‌ای از راهکارها، نرم‌افزارها و خدمات عملیاتی که برای تیم‌های IT ارائه می‌دهیم.
          </p>
          <div className="mt-6 flex gap-3">
            <Link
              href="/contact#contact"
              className="inline-flex items-center rounded-2xl px-5 py-3 bg-teal-500 hover:bg-teal-600 text-white transition"
            >
              ارائه مشاوره
            </Link>
            <Link
              href="/tools"
              className="inline-flex items-center rounded-2xl px-5 py-3 border-2 border-amber-400 text-amber-400 hover:bg-amber-50/10 transition"
            >
              مشاهده ابزارها
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {all.map((item) => (
              <div key={`${item.group}-${item.title}`} onClick={() => openModal(item)}>
                <FrameCard
                  title={item.title}
                  logo={item.logo}
                  summary={(item.paragraphs && item.paragraphs[0]) || "برای مشاهدهٔ جزئیات کلیک کنید."}
                  // دکمه‌های پایین کارت شبیه صفحه اول
                  ctas={[
                    {
                      label: "Specsheet",
                      href: "#", // اگر specsheet داری اینجا بگذار
                      tone: "outline",
                      disabled: true,
                    },
                    {
                      label: "درخواست مشاوره",
                      href: "/contact#contact",
                      tone: "primary",
                    },
                  ]}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <GlassModal open={open} onClose={() => setOpen(false)} title={modal.title} paragraphs={modal.paragraphs} />
    </>
  );
}