export default function AdsTag() {
  return (
    <>
      <script async src="https://www.googletagmanager.com/gtag/js?id=AW-17652097077"></script>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17652097077');
          `,
        }}
      />
    </>
  );
}
