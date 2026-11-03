/* ================= GERENCIAMENTO DE NAVEGAÇÃO - MÓDULO 10 ================= */
var slideAtual = 1;
var totalSlides = 4;

function atualizarNavegacao() {
    document.getElementById('txtProgress').innerText = "Slide " + slideAtual + " de " + totalSlides;
    document.getElementById('btnPrev').disabled = false;
    document.getElementById('btnPrev').innerHTML = (slideAtual === 1) ? "&#9664; Módulo 9" : "&#9664; Voltar";
    document.getElementById('btnNext').innerHTML = (slideAtual === totalSlides) ? "Finalizar &#10004;" : "Avançar &#9654;";
}

function mudarSlide(direcao) {
    if (direcao === 1 && slideAtual === totalSlides) { 
        exibirToast("🎉 Treinamento de Qualidade Concluído com Sucesso!");
        setTimeout(() => {
            window.location.href = 'index.html'; // Retorna ao menu principal ou hub
        }, 3000);
        return; 
    }
    if (direcao === -1 && slideAtual === 1) { 
        window.location.href = 'apresentacao8.html'; // Retorna para o Ishikawa
        return; 
    }

    document.getElementById('s' + slideAtual).classList.remove('active');
    slideAtual += direcao;
    document.getElementById('s' + slideAtual).classList.add('active');
    
    atualizarNavegacao();
}

function exibirToast(msg) {
    var toast = document.getElementById('toast');
    toast.innerText = msg;
    toast.classList.add('show');
    setTimeout(function() { toast.classList.remove('show'); }, 3000);
}

window.onload = function() {
    atualizarNavegacao();
};