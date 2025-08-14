// components/Layout.js
import Head from "next/head";
import Header from "./Header";

export default function Layout({ title = "Satrass", children }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
      </Head>

      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <footer className="bg-black text-white">
          <div className="max-w-6xl mx-auto px-4 py-6 text-center">
            © {new Date().getFullYear()} ساتراس — همه حقوق محفوظ است
          </div>
        </footer>
      </div>
    </>
  );
}