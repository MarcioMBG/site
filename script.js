

(function() {
    emailjs.init("RtokT3XOfmnNSyo1C"); // sua Public Key
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