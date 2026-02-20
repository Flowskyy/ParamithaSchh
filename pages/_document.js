import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="id">
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Belleza&display=swap" rel="stylesheet" />
      </Head>
      <body className="bg-dark text-white antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
