var slideAtual = 1; 
var totalSlides = 9;

function atualizarNavegacao() {
    document.getElementById('txtProgress').innerText = 'Slide ' + slideAtual + ' de ' + totalSlides;
    document.getElementById('btnPrev').disabled = false;
    document.getElementById('btnPrev').innerHTML = (slideAtual === 1) ? '&#9664; Módulo 2' : '&#9664; Voltar';
    document.getElementById('btnNext').innerHTML = (slideAtual === totalSlides) ? 'Módulo 4 &#9654;' : 'Avançar &#9654;';
}

function mudarSlide(direcao) {
    if (direcao === 1 && slideAtual === totalSlides) { 
        window.location.href = 'apresentacao3.html'; 
        return; 
    }
    if (direcao === -1 && slideAtual === 1) { 
        window.location.href = 'apresentacao1.html'; 
        return; 
    }
    
    document.getElementById('s' + slideAtual).classList.remove('active');
    slideAtual += direcao;
    document.getElementById('s' + slideAtual).classList.add('active');
    atualizarNavegacao();

    if(slideAtual === 2) s2_Normal();
    if(slideAtual === 3) s3_Reset();
    if(slideAtual === 4) s4_Normal();
    if(slideAtual === 5) s5_Simular(false);
    if(slideAtual === 6) s6_Novo_Simular(false);
    if(slideAtual === 7) s7_Simular(false);
    if(slideAtual === 8) s8_Simular(4);
}

/* ================= FUNÇÕES AUXILIARES ESTATÍSTICAS ================= */
function calcMedia(arr) { 
    var s = 0; 
    for(var i=0; i<arr.length; i++) s += arr[i]; 
    return s / arr.length; 
}

function calcMediana(arr) { 
    var s = arr.slice().sort(function(a,b){return a-b;}); 
    var m = Math.floor(s.length/2); 
    return (s.length%2===0)?(s[m-1]+s[m])/2:s[m]; 
}

function calcVarAmostral(arr, m) { 
    var sq = 0; 
    for(var i=0; i<arr.length; i++) sq += Math.pow(arr[i]-m, 2); 
    return sq / (arr.length - 1); 
}

/* ================= LÓGICA DOS SLIDES ================= */

// SLIDE 2: MÉDIA
var s2_chart = document.getElementById('chart-media');
function renderS2(dados) {
    var antigas = s2_chart.querySelectorAll('.bar'); 
    for(var i=0; i<antigas.length; i++) s2_chart.removeChild(antigas[i]);
    
    var media = calcMedia(dados); 
    var maxView = 120;

    for(var j=0; j<dados.length; j++) {
        var val = dados[j]; 
        var bar = document.createElement('div'); 
        bar.className = 'bar';
        var h = (val / maxView) * 140; 
        bar.style.height = h + 'px'; 
        if(val < 20) bar.style.background = '#ef4444';
        
        var lbl = document.createElement('div'); 
        lbl.className = 'bar-label'; 
        lbl.innerText = val; 
        bar.appendChild(lbl); 
        s2_chart.appendChild(bar);
    }
    document.getElementById('line-media-val').style.bottom = ((media / maxView) * 140) + 'px';
    document.getElementById('txt-media').innerText = media.toFixed(1);
}

function s2_Normal() { 
    renderS2([48, 50, 52, 49, 51]); 
    document.getElementById('msg-media').innerHTML = 'Peças próximas a 50mm. Média equilibrada.'; 
}

function s2_Outlier() { 
    renderS2([48, 50, 52, 49, 10]); 
    document.getElementById('msg-media').innerHTML = '<span style="color:#ef4444; font-weight:bold;">ALERTA:</span> Peça de 10mm distorceu a média.'; 
}

// SLIDE 3: MODA
var s3_val = [2, 5, 3];
function renderS3() {
    var maxVal = Math.max(s3_val[0], s3_val[1], s3_val[2]); 
    if(maxVal === 0) maxVal = 1; 
    var modaTexto = '';

    for(var i=1; i<=3; i++) {
        var bin = document.getElementById('bin-' + i); 
        var h = (s3_val[i-1] / maxVal) * 140; 
        if(h < 30 && s3_val[i-1] > 0) h = 30; 
        if(s3_val[i-1] === 0) h = 0;
        
        bin.style.height = h + 'px'; 
        document.getElementById('c-' + i).innerText = s3_val[i-1]; 
        bin.classList.remove('is-moda');

        if(s3_val[i-1] === maxVal && maxVal > 0) { 
            bin.classList.add('is-moda'); 
            if(i===1) modaTexto='49mm'; 
            if(i===2) modaTexto='50mm'; 
            if(i===3) modaTexto='51mm'; 
        }
    }
    document.getElementById('txt-moda').innerText = maxVal > 0 ? modaTexto : '--';
}

function s3_Add(index) { s3_val[index-1]++; renderS3(); }
function s3_Reset() { s3_val = [0,0,0]; renderS3(); }

// SLIDE 4: MEDIANA
var s4_container = document.getElementById('box-mediana');
function renderS4(dados) {
    s4_container.innerHTML = ''; 
    var media = calcMedia(dados); 
    var mediana = calcMediana(dados);

    for(var i=0; i<dados.length; i++) { 
        var b = document.createElement('div'); 
        b.className = 'median-box'; 
        b.innerText = dados[i]; 
        if(i === 2) b.classList.add('is-median'); 
        s4_container.appendChild(b); 
    }
    document.getElementById('txt-med-media').innerText = media.toFixed(1); 
    document.getElementById('txt-med-mediana').innerText = mediana;
}

function s4_Normal() { 
    renderS4([48, 49, 50, 51, 52]); 
    document.getElementById('msg-mediana').innerHTML = 'Média e Mediana iguais.'; 
}

function s4_Outlier() { 
    renderS4([48, 49, 50, 51, 999]); 
    document.getElementById('msg-mediana').innerHTML = 'A Média explodiu, mas a Mediana continuou firme em 50.'; 
}

// SLIDE 5: VARIÂNCIA (CONCEITO)
function s5_Simular(instavel) {
    var arr = instavel ? [15, 30, 70, 85] : [46, 48, 52, 54];
    for(var i=1; i<=4; i++) document.getElementById('v-dot-' + i).style.left = arr[i-1] + '%';
    
    document.getElementById('txt-variancia').innerText = calcVarAmostral(arr, 50).toFixed(0);
    var sq = document.getElementById('v-square-vis'); 
    var t = instavel ? 85 : 35; 
    sq.style.width = t + 'px'; 
    sq.style.height = t + 'px';
}

// SLIDE 6: GEOMETRIA DA VARIÂNCIA
function s6_Novo_Simular(instavel) {
    var desvios = instavel ? [-40, 85, -20, 95, -60] : [-15, 25, -10, 20, -5]; 
    var soma = 0; 
    var posX = [15, 32, 50, 68, 85];

    for(var i=1; i<=5; i++) {
        var val = desvios[i-1]; 
        var absVal = Math.abs(val); 
        soma += (absVal * absVal);

        var sq = document.getElementById('gs-' + i); 
        var dot = document.getElementById('gd-' + i);
        
        sq.style.left = posX[i-1] + '%'; 
        sq.style.width = absVal + 'px'; 
        sq.style.height = absVal + 'px'; 
        dot.style.left = posX[i-1] + '%';

        if(val < 0) { 
            sq.style.top = 'calc(50% - ' + absVal + 'px)'; 
            dot.style.top = 'calc(50% - ' + absVal + 'px)'; 
        } else { 
            sq.style.top = '50%'; 
            dot.style.top = 'calc(50% + ' + absVal + 'px)'; 
        }
    }
    document.getElementById('txt-soma-areas').innerText = soma;
}

// SLIDE 7: DESVIO PADRÃO
function s7_Simular(ruim) {
    var arr = ruim ? [20, 32, 44, 56, 68, 80] : [45, 47, 49, 51, 53, 55];
    for(var i=1; i<=6; i++) document.getElementById('s7-dot-' + i).style.left = arr[i-1] + '%';
    
    var desvio = Math.sqrt(calcVarAmostral(arr, 50)); 
    document.getElementById('txt-dp').innerText = desvio.toFixed(2);
    
    var zone = document.getElementById('zone-1'); 
    var w = desvio * 2; 
    zone.style.width = w + '%'; 
    zone.style.left = (50 - (w/2)) + '%';
}

// SLIDE 8: ERRO PADRÃO DA MÉDIA
function s8_Simular(n) {
    var epm = 12.0 / Math.sqrt(n); 
    document.getElementById('txt-epm-n').innerText = n; 
    document.getElementById('txt-epm-res').innerText = epm.toFixed(2);
    
    document.getElementById('epm-visual').style.width = (epm * 20) + 'px'; 
    document.getElementById('epm-visual').style.height = (epm * 20) + 'px';
}

/* ================= INICIALIZAÇÃO ================= */
atualizarNavegacao();

