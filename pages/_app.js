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