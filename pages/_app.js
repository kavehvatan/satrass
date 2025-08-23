import "../styles/globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

function MyApp({ Component, pageProps }) {
  const hideHeader = Component.hideHeader === true;
  const hideFooter = Component.hideFooter === true;

  return (
    <div className="min-h-screen flex flex-col">
      {!hideHeader && <Header />}
      <main className="flex-1">
        <Component {...pageProps} />
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
}

export default MyApp;