import "../styles/globals.css";
import Header from "../components/Header";

export default function App({ Component, pageProps }) {
  return (
    <div dir="rtl" lang="fa">
      <Header />
      <Component {...pageProps} />
    </div>
  );
}