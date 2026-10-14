var slideAtual = 1;
var totalSlides = 6; 

function atualizarNavegacao() {
    document.getElementById('txtProgress').innerText = "Slide " + slideAtual + " de " + totalSlides;
    document.getElementById('btnPrev').disabled = false;
    document.getElementById('btnPrev').innerHTML = (slideAtual === 1) ? "&#9664; Módulo 3" : "&#9664; Voltar";
    document.getElementById('btnNext').innerHTML = (slideAtual === totalSlides) ? "Módulo 5 &#9654;" : "Avançar &#9654;";
}

function mudarSlide(direcao) {
    if (direcao === 1 && slideAtual === totalSlides) { 
        window.location.href = 'apresentacao4.html'; 
        return; 
    }
    if (direcao === -1 && slideAtual === 1) { 
        window.location.href = 'apresentacao2.html'; 
        return; 
    }
    
    document.getElementById('s' + slideAtual).classList.remove('active');
    slideAtual += direcao;
    document.getElementById('s' + slideAtual).classList.add('active');
    
    atualizarNavegacao();

    if(slideAtual === 2 && binsHistTotal === 0) s2_BuildHist();
    if(slideAtual === 3) s3_Setup();
    if(slideAtual === 4) s4_SetSkew('simetrica');
    if(slideAtual === 5) s5_SetKurt('meso');
}

function gerarCaminhoSVG(altura, centro, largEsq, largDir, potencia) {
    var path = "M 0 260 ";
    for(var x = 0; x <= 600; x += 5) {
        var w = (x < centro) ? largEsq : largDir;
        var y = altura * Math.exp(-Math.pow(Math.abs(x - centro) / w, potencia));
        path += "L " + x + " " + (260 - y) + " ";
    }
    path += "L 600 260 Z";
    return path;
}

var binsHist = [0,0,0,0,0,0,0,0,0,0,0];
var binsHistTotal = 0;

function s2_BuildHist() {
    var box = document.getElementById('box-histograma');
    box.innerHTML = '';
    for(var i = 0; i < 11; i++) {
        var div = document.createElement('div');
        div.className = 'hist-bin';
        div.id = 'bin-h-' + i;
        div.innerHTML = '<span class="hist-val" id="val-h-' + i + '"></span><span class="hist-lbl">' + (45 + i) + '</span>';
        box.appendChild(div);
    }
}

function s2_UpdateVisuals() {
    var max = Math.max.apply(null, binsHist);
    if(max === 0) max = 1; 
    
    for(var i = 0; i < 11; i++) {
        var el = document.getElementById('bin-h-' + i);
        var txt = document.getElementById('val-h-' + i);
        var h = (binsHist[i] / max) * 200;
        if(binsHist[i] > 0 && h < 25) h = 25;
        
        el.style.height = h + 'px';
        txt.innerText = binsHist[i] > 0 ? binsHist[i] : '';
    }
    document.getElementById('txt-hist-total').innerText = binsHistTotal;
}

function s2_AdicionarLote(alvo) {
    for(var i = 0; i < 50; i++) {
        var r = (Math.random() + Math.random() + Math.random()) / 3;
        var num = Math.round(45 + (r * 10));
        if(num >= 45 && num <= 55) {
            binsHist[num - 45]++;
            binsHistTotal++;
        }
    }
    s2_UpdateVisuals();
}

function s2_AdicionarDesvio() {
    for(var i = 0; i < 10; i++) {
        var num = 53 + Math.round(Math.random() * 2);
        if(num <= 55) {
            binsHist[num - 45]++;
            binsHistTotal++;
        }
    }
    s2_UpdateVisuals();
    document.getElementById('msg-hist').innerHTML = "<span style='color:#ef4444; font-weight:bold;'>Alerta!</span> Desgaste na máquina gerou um 'calombo' na direita. O histograma revela falhas que a Média esconde!";
}

function s2_Reset() {
    binsHist = [0,0,0,0,0,0,0,0,0,0,0];
    binsHistTotal = 0;
    s2_UpdateVisuals();
    document.getElementById('msg-hist').innerText = "Gere lotes para ver a curva se formar. Com poucos dados, é confuso. Com muitos dados, o padrão da máquina se revela.";
}

function s3_Setup() {
    var path = gerarCaminhoSVG(220, 300, 100, 100, 2);
    document.getElementById('gauss-base').setAttribute('d', path);
    document.getElementById('gauss-fill').setAttribute('d', path);
    document.getElementById('rect-sigma').setAttribute('width', "0");
    document.getElementById('rect-sigma').setAttribute('x', "300");
}

function s3_AnimarSigma(sigma, percent, larguraPixel) {
    document.getElementById('txt-gauss-pct').innerText = percent + " %";
    
    var ret = document.getElementById('rect-sigma');
    ret.setAttribute('width', larguraPixel);
    ret.setAttribute('x', 300 - (larguraPixel / 2));

    var msgs = [
        "",
        "<b>1 Desvio Padrão (68%)</b>: Em um processo ajustado, quase 70% das peças vão estar muito coladas ao Alvo.",
        "<b>2 Desvios Padrão (95.4%)</b>: Engloba a esmagadora maioria. Se o limite de especificação do cliente estiver aqui, 4.6% vai para o lixo.",
        "<b>3 Desvios Padrão (99.7%)</b>: O Limite de Controle Natural da máquina (LSC/LIC). Praticamente 100% da produção fica dessa área."
    ];
    document.getElementById('msg-gauss').innerHTML = msgs[sigma];
}

function s4_SetSkew(tipo) {
    var path, txt, msg, lMedia, lMediana, lModa;

    if(tipo === 'simetrica') {
        path = gerarCaminhoSVG(200, 300, 100, 100, 2);
        txt = "Simétrica";
        msg = "Média, Mediana e Moda são exatamente iguais (estão sobrepostas). O processo está ideal.";
        lMedia = "50%"; lMediana = "50%"; lModa = "50%";
    } 
    else if (tipo === 'positiva') {
        path = gerarCaminhoSVG(200, 200, 70, 180, 2);
        txt = "Assimetria Positiva";
        msg = "A cauda longa vai para a direita. Valores altos raros puxam a <b>Média</b> para cima. Ex: Salários de uma empresa ou retrabalho demorado.";
        lModa = "33.3%"; 
        lMediana = "42%"; 
        lMedia = "50%"; 
    }
    else if (tipo === 'negativa') {
        path = gerarCaminhoSVG(200, 400, 180, 70, 2);
        txt = "Assimetria Negativa";
        msg = "A cauda longa vai para a esquerda. Existe uma barreira física que bloqueia valores maiores. A <b>Média</b> despenca.";
        lModa = "66.6%"; 
        lMediana = "58%"; 
        lMedia = "50%"; 
    }

    document.getElementById('curve-skew').setAttribute('d', path);
    document.getElementById('txt-skew').innerText = txt;
    document.getElementById('msg-skew').innerHTML = msg;

    document.getElementById('sk-moda').style.left = lModa;
    document.getElementById('sk-mediana').style.left = lMediana;
    document.getElementById('sk-media').style.left = lMedia;
}

function s5_SetKurt(tipo) {
    var pathBase = gerarCaminhoSVG(160, 300, 120, 120, 2);
    document.getElementById('curve-kurt-ref').setAttribute('d', pathBase);

    var path, txt, msg;

    if(tipo === 'meso') {
        path = gerarCaminhoSVG(160, 300, 120, 120, 2);
        txt = "Mesocúrtica";
        msg = "Comportamento Normal esperado. Balanço perfeito entre os dados centrais e as caudas.";
    } 
    else if(tipo === 'lepto') {
        path = gerarCaminhoSVG(240, 300, 80, 80, 1.3);
        txt = "Leptocúrtica";
        msg = "Pico agudo. Muito focado no centro, mas as caudas são 'pesadas' (mais gordinhas nos extremos). Indica excesso de peças exatas no alvo, ou que misturamos dois lotes diferentes.";
    }
    else if(tipo === 'plati') {
        path = gerarCaminhoSVG(100, 300, 160, 160, 2.5);
        txt = "Platicúrtica";
        msg = "Achatada e larga. As peças estão muito espalhadas sem focar em um alvo único. A máquina está 'solta', com alta variação.";
    }

    document.getElementById('curve-kurt').setAttribute('d', path);
    document.getElementById('txt-kurt').innerText = txt;
    document.getElementById('msg-kurt').innerHTML = msg;
}

atualizarNavegacao();

// Ativação do modo Tela Cheia no primeiro clique
document.addEventListener('click', function() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(function(erro) {
            console.log("O ecrã inteiro foi bloqueado: " + erro.message);
        });
    }
}, { once: true });