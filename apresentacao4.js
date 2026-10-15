var slideAtual = 1;
var totalSlides = 6; 

function atualizarNavegacao() {
    document.getElementById('txtProgress').innerText = "Slide " + slideAtual + " de " + totalSlides;
    document.getElementById('btnPrev').disabled = false;
    document.getElementById('btnPrev').innerHTML = (slideAtual === 1) ? "&#9664; Módulo 4" : "&#9664; Voltar";
    document.getElementById('btnNext').innerHTML = (slideAtual === totalSlides) ? "Módulo 6 &#9654;" : "Avançar &#9654;";
}

function mudarSlide(direcao) {
    if (direcao === 1 && slideAtual === totalSlides) { 
        window.location.href = 'apresentacao5.html'; 
        return; 
    }
    if (direcao === -1 && slideAtual === 1) { 
        window.location.href = 'apresentacao3.html'; 
        return; 
    }
    
    document.getElementById('s' + slideAtual).classList.remove('active');
    slideAtual += direcao;
    document.getElementById('s' + slideAtual).classList.add('active');
    
    atualizarNavegacao();

    if(slideAtual === 2) s2_Animar(false);
    if(slideAtual === 3) s3_SetCp(1.00, 50);
    if(slideAtual === 4) s4_SetCpk('centro');
}

function gerarCurvaNormal(altura, centro, sigma) {
    var path = "M 0 260 ";
    for(var x = 0; x <= 600; x += 5) {
        var dif = x - centro;
        var pot = -(dif * dif) / (2 * sigma * sigma);
        var y = altura * Math.exp(pot);
        path += "L " + x + " " + (260 - y) + " ";
    }
    path += "L 600 260 Z";
    return path;
}

function s2_Animar(estreita) {
    var el = document.getElementById('curve-s2');
    var txtVop = document.getElementById('txt-s2-vop');
    var msg = document.getElementById('msg-s2');

    if(estreita) {
        el.setAttribute('d', gerarCurvaNormal(220, 300, 25));
        el.className = 'curve-path curve-good';
        txtVop.innerText = "25 mm";
        txtVop.style.color = "#10b981";
        msg.innerHTML = "<b>Processo Capaz:</b> O carro é estreito. Ele entra e sai da garagem com folga. Zero refugo.";
    } else {
        el.setAttribute('d', gerarCurvaNormal(120, 300, 65));
        el.className = 'curve-path curve-bad';
        txtVop.innerText = "65 mm";
        txtVop.style.color = "#ef4444";
        msg.innerHTML = "<b>Processo Incapaz:</b> A variação natural da máquina (VoP) é maior que o limite do cliente (VoC). As caudas da curva batem nas paredes (geram refugo).";
    }
}

function s3_SetCp(valor, sigma) {
    var el = document.getElementById('curve-cp');
    var panel = document.getElementById('panel-cp');
    var txtVal = document.getElementById('txt-cp-val');
    var txtSts = document.getElementById('txt-cp-status');
    var msg = document.getElementById('msg-cp');

    var h = 200 * (50 / sigma); 
    if(h > 240) h = 240;

    el.setAttribute('d', gerarCurvaNormal(h, 300, sigma));
    txtVal.innerText = valor.toFixed(2);

    if(valor < 1) {
        el.className = 'curve-path curve-bad';
        panel.style.borderLeftColor = "#ef4444";
        txtVal.style.color = "#ef4444"; txtSts.style.color = "#ef4444";
        txtSts.innerText = "Incapaz";
        msg.innerHTML = "<b>Cp < 1:</b> A dispersão (6s) é maior que a tolerância do cliente. A curva 'vaza' para fora. Tem refugo de ambos os lados.";
    } else if (valor === 1) {
        el.className = 'curve-path';
        panel.style.borderLeftColor = "#f59e0b";
        txtVal.style.color = "#f59e0b"; txtSts.style.color = "#f59e0b";
        txtSts.innerText = "No Limite";
        msg.innerHTML = "<b>Cp = 1:</b> A curva bate exatamente nos limites LSE e LIE. Se a máquina desregular um milímetro, começa a fabricar refugo.";
    } else {
        el.className = 'curve-path curve-good';
        panel.style.borderLeftColor = "#10b981";
        txtVal.style.color = "#10b981"; txtSts.style.color = "#10b981";
        txtSts.innerText = "Capaz e Seguro";
        msg.innerHTML = "<b>Cp = 1.33:</b> Excelente. A curva é fina. Existe um 'colchão de segurança' entre o fim da curva e as paredes de especificação.";
    }
}

function s4_SetCpk(posicao) {
    var el = document.getElementById('curve-cpk');
    var panel = document.getElementById('panel-cpk');
    var txtVal = document.getElementById('txt-cpk-val');
    var msg = document.getElementById('msg-cpk');
    
    var sigma = 37.5;
    var mu = 300;
    var cpk = 1.33;

    if(posicao === 'esq') {
        mu = 200;
        cpk = 0.71;
        el.className = 'curve-path curve-bad';
        panel.style.borderLeftColor = "#ef4444";
        txtVal.style.color = "#ef4444";
        msg.innerHTML = "<b>Deslocado para Esquerda:</b> O ferramental gastou e a média caiu. A cauda esquerda invadiu o LIE. Cpk despencou para 0.71 (Refugo!).";
    } 
    else if (posicao === 'dir') {
        mu = 400;
        cpk = 0.71;
        el.className = 'curve-path curve-bad';
        panel.style.borderLeftColor = "#ef4444";
        txtVal.style.color = "#ef4444";
        msg.innerHTML = "<b>Deslocado para Direita:</b> O operador errou o setup. A cauda direita invadiu o LSE. O Potencial (Cp) da máquina é inútil se ela estiver descentrada.";
    }
    else {
        mu = 300;
        cpk = 1.33;
        el.className = 'curve-path curve-good';
        panel.style.borderLeftColor = "#10b981";
        txtVal.style.color = "#10b981";
        msg.innerHTML = "<b>Perfeitamente Centrada:</b> A média (µ) está exatamente no Alvo. Neste cenário perfeito, o Cpk é igual ao Cp (1.33). Qualidade total.";
    }

    el.setAttribute('d', gerarCurvaNormal(200, mu, sigma));
    txtVal.innerText = cpk.toFixed(2);
}

atualizarNavegacao();

