import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="description" content="BlackPlum - Exclusive access to premium real estate investments for accredited investors. Start investing with as little as $5,000." />
        <meta property="og:title" content="BlackPlum - Private Investment Platform" />
        <meta property="og:description" content="Access institutional-quality real estate investments with lower minimums and full transparency." />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="BlackPlum" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="BlackPlum - Private Investment Platform" />
        <meta name="twitter:description" content="Access institutional-quality real estate investments with lower minimums and full transparency." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
} 