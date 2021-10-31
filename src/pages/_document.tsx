import { Head, Html, Main, NextScript } from 'next/document'

const MyDocument = () => (
  <Html lang="en">
    <Head>
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700;900&display=swap"
        rel="stylesheet"
      />

      <link rel="icon" href="/favicon.ico" />

      <meta name="description" content="News portal" />
    </Head>
    <body>
      <Main />
      <NextScript />
    </body>
  </Html>
)

export default MyDocument
