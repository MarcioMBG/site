/* ================= GERENCIAMENTO DE NAVEGAÇÃO ================= */
var slideAtual = 1;
var totalSlides = 4;

function atualizarNavegacao() {
    document.getElementById('txtProgress').innerText = "Slide " + slideAtual + " de " + totalSlides;
    document.getElementById('btnPrev').disabled = false;
    document.getElementById('btnPrev').innerHTML = (slideAtual === 1) ? "&#9664; Módulo 8" : "&#9664; Voltar";
    document.getElementById('btnNext').innerHTML = (slideAtual === totalSlides) ? "Aguarde 10" : "Avançar &#9654;";
}

function mudarSlide(direcao) {
    if (direcao === 1 && slideAtual === totalSlides) { 
        exibirToast("🎓 Módulo 9 Concluído! Redirecionando para o início...");
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
        return; 
    }
    if (direcao === -1 && slideAtual === 1) { 
        window.location.href = 'apresentacao7.html'; 
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