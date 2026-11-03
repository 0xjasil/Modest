import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
          <link
            href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500;600&family=Jost:wght@300;400;500;600;700&display=swap"
            rel="stylesheet"
          />
          <link rel="icon" href="/brand/favicon-64.png" type="image/png" />
          <link rel="apple-touch-icon" href="/brand/apple-touch-icon.png" />
        </Head>
        <body className="bg-mb-bg text-mb-body antialiased selection:bg-mb-surface-strong selection:text-mb-primary">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
