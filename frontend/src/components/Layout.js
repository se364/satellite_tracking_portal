import Head from 'next/head';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-white">
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>{children}</main>
    </div>
  );
}