// pages/_app.js
import '@/styles/globals.css';                 // اگر alias @ نداری، از '../styles/globals.css' استفاده کن
import Header from '@/components/Header';     // اگر alias @ ندارید: '../components/Header'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Header />
      <Component {...pageProps} />
    </>
  );
}