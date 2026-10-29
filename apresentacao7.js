/* ================= GERENCIAMENTO DE NAVEGAÇÃO - MÓDULO 7 ================= */
var slideAtual = 1;
var totalSlides = 5;

function atualizarNavegacao() {
    document.getElementById('txtProgress').innerText = "Slide " + slideAtual + " de " + totalSlides;
    document.getElementById('btnPrev').disabled = false;
    document.getElementById('btnPrev').innerHTML = (slideAtual === 1) ? "&#9664; Módulo 7" : "&#9664; Voltar";
    document.getElementById('btnNext').innerHTML = (slideAtual === totalSlides) ? "Módulo 9" : "Avançar &#9654;";
}

function mudarSlide(direcao) {
    if (direcao === 1 && slideAtual === totalSlides) { 
        exibirToast("🎓 Módulo 8 Concluído! Redirecionando para o Módulo 9...");
        setTimeout(function() {
            window.location.href = 'apresentacao8.html';
        }, 1500);
        return; 
    }
    if (direcao === -1 && slideAtual === 1) { 
        window.location.href = 'apresentacao6.html'; 
        return; 
    }
    
    document.getElementById('s' + slideAtual).classList.remove('active');
    slideAtual += direcao;
    document.getElementById('s' + slideAtual).classList.add('active');
    
    atualizarNavegacao();
}

function exibirToast(msg) {
    var toast = document.getElementById('toast');
    if (!toast) return;
    toast.innerText = msg;
    toast.classList.add('show');
    setTimeout(function() { toast.classList.remove('show'); }, 3000);
}

window.onload = function() {
    atualizarNavegacao();
};
