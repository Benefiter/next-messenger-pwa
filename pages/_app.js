import '../styles/globals.css';
import Layout from '../components/Layout';
import { MessengerProvider } from '../components/Context/MessengerContext';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link
          href='https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css'
          rel='stylesheet'
          integrity='sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3'
          crossOrigin='anonymous'
        />
        <link
          rel='stylesheet'
          href='https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/font/bootstrap-icons.css'
        />
      </Head>

      <MessengerProvider>
        <Component {...pageProps} />
      </MessengerProvider>
    </>
  );
}

export default MyApp;
