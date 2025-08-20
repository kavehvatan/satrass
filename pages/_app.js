// pages/_app.js
import '../styles/globals.css';           // مسیر نسبی به استایل سراسری
import Header from '../components/Header'; // مسیر نسبی به کامپوننت هدر

export default function App({ Component, pageProps }) {
  return (
    <>
      <Header />
      <Component {...pageProps} />
    </>
  );
}