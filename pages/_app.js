import '../styles/layout.css'
import 'react-datepicker/dist/react-datepicker.css'
import '../components/InfoPane/MaintenanceHistory/table.css'
import Head from 'next/head'

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>HFI Demo</title>
        <meta name="HFI Demo" content="HFI Demo" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Component {...pageProps} />
    </>
  )
}
