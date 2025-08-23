// pages/_app.js
import '../styles/globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useRouter } from 'next/router';

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();

  return (
    <div dir="rtl" lang="fa">
      <Header />
      <Component {...pageProps} />
      {/* فوتر سراسری را همه‌جا نشان بده، به جز صفحهٔ خانه */}
      {router.pathname !== '/' && <Footer />}
    </div>
  );
}

// pages/_app.js
import "../styles/globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function MyApp({ Component, pageProps }) {
  return (
    <div dir="rtl" lang="fa" className="min-h-[100svh] flex flex-col">
      <Header />

      {/* محتوای هر صفحه */}
      <main className="flex-1">
        <Component {...pageProps} />
      </main>

      {/* فوتر سراسری؛ به کف ستون می‌چسبد */}
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}