

// 1. CARREGAMENTO DO GOOGLE ANALYTICS (GA4)
(function() {
  const GA_ID = 'G-FYJ1W2FVJ4';

  // Cria a tag <script> do Google Analytics
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(script);

  // Inicializa o gtag
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', GA_ID, {
    anonymize_ip: true // importante para LGPD
  });
})();

    //Fim da Tag do Google Analitcs//
