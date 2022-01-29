import { useEffect } from "react";
import type { AppProps } from "next/app";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    document.documentElement.lang = "en";
  }, []);
  return (
    <>
      <style>{`body { display: block !important`}</style>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
