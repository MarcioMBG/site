
var slideAtual = 1; var totalSlides = 8;
function atualizarNavegacao() {
    document.getElementById('txtProgress').innerText = 'Slide ' + slideAtual + ' de ' + totalSlides;
    document.getElementById('btnPrev').innerHTML = (slideAtual === 1) ? '&#9664; Módulo 1' : '&#9664; Voltar';
    document.getElementById('btnPrev').disabled = false;
    document.getElementById('btnNext').innerHTML = (slideAtual === totalSlides) ? 'Módulo 3 &#9654;' : 'Avançar &#9654;';
    document.getElementById('btnNext').disabled = false;
}
function mudarSlide(direcao) {
    // Caminhos corrigidos para relativos
    if (direcao === -1 && slideAtual === 1) { 
        window.location.href = 'apresentacao0.html'; 
        return; 
    }
    if (direcao === 1 && slideAtual === totalSlides) { 
        window.location.href = 'apresentacao2.html'; 
        return; 
    }
    document.getElementById('s' + slideAtual).classList.remove('active');
    slideAtual += direcao;
    document.getElementById('s' + slideAtual).classList.add('active');
    atualizarNavegacao();
    
    if(slideAtual === 2 && dots_s3.length === 0) s3_Setup();
    if(slideAtual === 3) s4_InitGrid();
    if(slideAtual === 4 && dots_s2.length === 0) s2_Setup();
    if(slideAtual === 6 && objs_s6.length === 0) s6_Setup();
    if(slideAtual === 7) s7_Reset();
}

var dots_s2 = []; var isSampledS2 = false;
function s2_Setup() {
    var box = document.getElementById('box-s2');
    for(var i=0; i<100; i++) {
        var dot = document.createElement('div'); dot.className = 'particula'; dot.id = 's2-p-' + i;
        var isBad = (i >= 80); if(isBad) dot.classList.add('bad'); else dot.classList.add('green');
        var l = 5 + Math.random() * 50; var t = isBad ? (70 + Math.random() * 15) : (10 + Math.random() * 55);
        dot.style.left = l + '%'; dot.style.top = t + '%'; dot.setAttribute('data-orig-l', l); dot.setAttribute('data-orig-t', t);
        box.appendChild(dot); dots_s2.push(dot);
    }
}
function s2_Coletar(viciada) {
    if(isSampledS2) s2_Reset(true); isSampledS2 = true;
    var escolhidos = []; var countBad = 0;
    if(viciada) {
        for(var j=0; j<10; j++) escolhidos.push(j);
        document.getElementById('msg-s2').innerHTML = '<b>VIÉS CONFIRMADO!</b> Pegamos as 10 primeiras da caixa. O inspetor vai aprovar o lote achando que tem 0% de defeito.';
    } else {
        while(escolhidos.length < 10) { var idx = Math.floor(Math.random() * 100); if(escolhidos.indexOf(idx) === -1) escolhidos.push(idx); }
        document.getElementById('msg-s2').innerHTML = '<b>Amostragem Representativa!</b> Misturando as peças, a amostra refletiu a realidade dos defeitos.';
    }
    for(var i=0; i<escolhidos.length; i++) {
        var dot = dots_s2[escolhidos[i]]; if(dot.classList.contains('bad')) countBad++;
        var nL = 70 + Math.random() * 20; var nT = 20 + Math.random() * 60;
        dot.style.left = nL + '%'; dot.style.top = nT + '%'; dot.style.transform = 'scale(1.5)'; dot.style.zIndex = '20';
    }
    var percent = (countBad / 10) * 100; document.getElementById('txt-s2-def').innerText = percent + '%';
}
function s2_Reset(isFast) {
    isSampledS2 = false;
    for(var i=0; i<dots_s2.length; i++) {
        var dot = dots_s2[i]; dot.style.left = dot.getAttribute('data-orig-l') + '%'; dot.style.top = dot.getAttribute('data-orig-t') + '%'; dot.style.transform = 'scale(1)'; dot.style.zIndex = '1';
    }
    document.getElementById('txt-s2-def').innerText = '0%';
    if(!isFast) document.getElementById('msg-s2').innerHTML = 'População com 20% de refugo escondido no fundo. Se não misturar, a amostragem falha.';
}

var dots_s3 = []; var isSampledS3 = false;
function s3_Setup() {
    var box = document.getElementById('box-s3');
    for(var i=0; i<100; i++) {
        var dot = document.createElement('div'); dot.className = 'particula'; dot.id = 's3-p-' + i;
        var l = 5 + Math.random() * 50; var t = 10 + Math.random() * 75;
        dot.style.left = l + '%'; dot.style.top = t + '%'; dot.setAttribute('data-orig-l', l); dot.setAttribute('data-orig-t', t);
        box.appendChild(dot); dots_s3.push(dot);
    }
}
function s3_Coletar() {
    if(isSampledS3) return; isSampledS3 = true;
    var escolhidos = []; while(escolhidos.length < 12) { var idx = Math.floor(Math.random() * 100); if(escolhidos.indexOf(idx) === -1) escolhidos.push(idx); }
    for(var i=0; i<escolhidos.length; i++) {
        var dot = dots_s3[escolhidos[i]]; var nL = 70 + Math.random() * 20; var nT = 20 + Math.random() * 60;
        dot.style.left = nL + '%'; dot.style.top = nT + '%'; dot.style.background = '#f59e0b';
    }
    document.getElementById('txt-s3-n').innerText = '12';
    document.getElementById('msg-s3').innerHTML = '<b>Amostra Aleatória Simples:</b> 12 peças foram retiradas do lote. Assumimos que o comportamento dessas 12 representa perfeitamente as 100.';
}
function s3_Reset() {
    if(!isSampledS3) return; isSampledS3 = false;
    for(var i=0; i<dots_s3.length; i++) { var dot = dots_s3[i]; dot.style.left = dot.getAttribute('data-orig-l') + '%'; dot.style.top = dot.getAttribute('data-orig-t') + '%'; dot.style.background = '#3b82f6'; }
    document.getElementById('txt-s3-n').innerText = '0';
    document.getElementById('msg-s3').innerText = 'Na estatística, calculamos os dados da Amostra (n) para tentar adivinhar a realidade da População (N).';
}

function s4_InitGrid() {
    var grid = document.getElementById('samplingGrid'); grid.innerHTML = '';
    for(var i = 1; i <= 24; i++) {
        var item = document.createElement('div'); item.className = 'sample-item'; item.innerText = i;
        if(i <= 8) item.classList.add('stratum-1'); else if(i <= 16) item.classList.add('stratum-2'); else item.classList.add('stratum-3');
        grid.appendChild(item);
    }
    document.getElementById('samplingInfo').innerHTML = '<b>População Total (N=24):</b> Divisão pronta em estratos para demonstração das técnicas.';
}
function s4_SimularAmostragem(tipo) {
    s4_InitGrid(); var items = document.querySelectorAll('.sample-item'); var infoBox = document.getElementById('samplingInfo'); var selecionados = [];
    if(tipo === 'simples') { selecionados = [2, 7, 11, 15, 19, 23]; infoBox.innerHTML = '<b>Amostra Aleatória Simples:</b> Todos os elementos têm igual probabilidade de serem sorteados.'; }
    else if(tipo === 'sistematica') { selecionados = [3, 7, 11, 15, 19, 23]; infoBox.innerHTML = '<b>Amostra Sistemática:</b> Elementos selecionados a partir de intervalos fixos e regulares.'; }
    else if(tipo === 'estratificada') { selecionados = [2, 5, 10, 14, 18, 22]; infoBox.innerHTML = '<b>Amostra Estratificada:</b> População dividida em subgrupos homogêneos e amostras retiradas proporcionalmente.'; }
    else if(tipo === 'conglomerado') { selecionados = [1, 2, 3, 4, 5, 6, 7, 8]; infoBox.innerHTML = '<b>Amostra por Conglomerado:</b> População dividida em grupos naturais e o grupo inteiro é selecionado.'; }
    else if(tipo === 'conveniencia') { selecionados = [1, 2, 3, 4]; infoBox.innerHTML = '<b>Amostra por Conveniência:</b> Seleção baseada puramente na facilidade de acesso aos elementos.'; }
    else if(tipo === 'julgamento') { selecionados = [6, 12, 18]; infoBox.innerHTML = '<b>Amostra por Julgamento / Intencional:</b> O pesquisador seleciona com base em seu conhecimento técnico.'; }
    else if(tipo === 'cotas') { selecionados = [1, 2, 9, 10, 17, 18]; infoBox.innerHTML = '<b>Amostra por Cotas:</b> Dividida em categorias pré-estabelecidas com quotas fixas para perfis.'; }
    else if(tipo === 'bolaneve') { selecionados = [4, 7, 13, 20]; infoBox.innerHTML = '<b>Amostra Bola de Neve:</b> Para populações de difícil acesso, onde cada entrevistado indica o próximo.'; }
    else if(tipo === 'desproporcional') { selecionados = [18, 19, 20, 21, 22, 23, 24]; infoBox.innerHTML = '<b>Amostra Desproporcional:</b> Estratos menores recebem maior proporção para análise aprofundada.'; }
    selecionados.forEach(function(idx) { if(items[idx-1]) items[idx-1].classList.add('selected'); });
}

var objs_s6 = []; var conf_s6 = [ { cor: '#ef4444', tam: 'P', h: 30, txt: 'P' }, { cor: '#3b82f6', tam: 'M', h: 45, txt: 'M' }, { cor: '#10b981', tam: 'G', h: 60, txt: 'G' }, { cor: '#ef4444', tam: 'M', h: 45, txt: 'M' }, { cor: '#10b981', tam: 'P', h: 30, txt: 'P' }, { cor: '#3b82f6', tam: 'G', h: 60, txt: 'G' } ];
function s6_Setup() {
    var box = document.getElementById('box-s6');
    for(var i=0; i<conf_s6.length; i++) {
        var c = conf_s6[i]; var obj = document.createElement('div'); obj.className = 'quali-item'; obj.style.background = c.cor; obj.style.width = c.h + 'px'; obj.style.height = c.h + 'px'; obj.innerText = c.txt;
        box.appendChild(obj); objs_s6.push(obj);
    }
    s6_Misturar();
}
function s6_Misturar() {
    for(var i=0; i<objs_s6.length; i++) { objs_s6[i].style.left = (15 + Math.random()*60) + '%'; objs_s6[i].style.bottom = (10 + Math.random()*50) + '%'; }
    for(var z=1; z<=3; z++) document.getElementById('z-nom-'+z).style.opacity = '0';
    document.getElementById('msg-s6').innerHTML = 'Peças desordenadas. Uma variável é <b>Qualitativa</b> quando atribuímos uma classe ou rótulo a ela em vez de medi-la.';
}
function s6_OrdenarNominal() {
    var basesX = [15, 50, 85]; var nomes = ['Vermelho', 'Azul', 'Verde'];
    for(var i=0; i<objs_s6.length; i++) {
        var obj = objs_s6[i]; var bg = obj.style.backgroundColor; var colIdx = 0; if(bg.indexOf('59') > -1) colIdx = 1; if(bg.indexOf('16') > -1) colIdx = 2;
        obj.style.left = (basesX[colIdx] - 5 + Math.random()*10) + '%'; obj.style.bottom = (20 + Math.random()*30) + '%';
    }
    for(var z=1; z<=3; z++) { var zone = document.getElementById('z-nom-'+z); zone.style.opacity = '1'; zone.innerText = nomes[z-1]; }
    document.getElementById('msg-s6').innerHTML = '<b>Variável Nominal:</b> Classificado por Cor. Não há ordem matemática. O Verde não é maior nem melhor que o Vermelho.';
}
function s6_OrdenarOrdinal() {
    var nomes = ['Tamanho P', 'Tamanho M', 'Tamanho G'];
    for(var i=0; i<objs_s6.length; i++) {
        var obj = objs_s6[i]; var txt = obj.innerText; var colIdx = 0; var bot = 20; if(txt === 'M') { colIdx = 1; bot = 40; } if(txt === 'G') { colIdx = 2; bot = 60; }
        obj.style.left = (15 + (colIdx*35) + Math.random()*5) + '%'; obj.style.bottom = bot + '%';
    }
    for(var z=1; z<=3; z++) { var zone = document.getElementById('z-nom-'+z); zone.style.opacity = '1'; zone.innerText = nomes[z-1]; }
    document.getElementById('msg-s6').innerHTML = '<b>Variável Ordinal:</b> Classificado por Tamanho. A ordem importa (P < M < G), formando uma hierarquia.';
}

var cont_Disc = 0; var timerCont = null;
function s7_StepDisc() {
    cont_Disc++; if(cont_Disc > 5) cont_Disc = 0; var pct = cont_Disc * 20; document.getElementById('mark-disc').style.left = pct + '%'; document.getElementById('txt-disc').innerText = cont_Disc;
}
function s7_SlideCont() {
    if(timerCont) clearInterval(timerCont); var alvo = 50.0 + (Math.random() * 1.0); var step = 0;
    timerCont = setInterval(function() {
        step++; var jitter = alvo + (Math.random() * 0.05 - 0.025); var pct = ((jitter - 50.0) / 1.0) * 100; if(pct < 0) pct = 0; if(pct > 100) pct = 100;
        document.getElementById('mark-cont').style.left = pct + '%'; document.getElementById('txt-cont').innerText = jitter.toFixed(3) + ' mm';
        if(step > 20) { clearInterval(timerCont); document.getElementById('txt-cont').innerText = alvo.toFixed(3) + ' mm'; document.getElementById('mark-cont').style.left = (((alvo - 50.0) / 1.0) * 100) + '%'; }
    }, 50);
}
function s7_Reset() {
    cont_Disc = 0; document.getElementById('mark-disc').style.left = '0%'; document.getElementById('txt-disc').innerText = '0';
    document.getElementById('mark-cont').style.left = '50%'; document.getElementById('txt-cont').innerText = '50.500 mm';
}

atualizarNavegacao();
