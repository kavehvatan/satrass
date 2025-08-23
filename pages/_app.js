// pages/_app.js
import "../styles/globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useRouter } from "next/router";

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const showFooter = router.pathname !== "/"; // فوتر همه‌جا به‌جز خانه

  return (
    <div dir="rtl" lang="fa" className="min-h-[100svh] flex flex-col">
      <Header />

      {/* محتوای هر صفحه */}
      <main className="flex-1">
        <Component {...pageProps} />
      </main>

      {/* فوتر سراسری؛ اگر صفحهٔ خانه نیست */}
      {showFooter && (
        <div className="mt-auto">
          <Footer />
        </div>
      )}
    </div>
  );
}