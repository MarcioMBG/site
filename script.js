

   
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

    


(function() {
    emailjs.init("iQ-_OwbyNFL0ui_ww"); // sua Public Key
})();

document.getElementById("formContato").addEventListener("submit", function(event) {
    event.preventDefault(); // evita recarregar a página

    emailjs.send("service_iqnwo3q", "template_hcvsai8", {
        nome: document.getElementById("nome").value,
        email: document.getElementById("email").value,
        telefone: document.getElementById("telefone").value,
        mensagem: document.getElementById("mensagem").value
    })
    .then(function(response) {
        alert("Mensagem enviada com sucesso! 🚀");
        document.getElementById("formContato").reset();
    }, function(error) {
        alert("Erro ao enviar mensagem 😢");
        console.log("Erro:", error);
    });
});



