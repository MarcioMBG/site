var slideAtual = 1; var totalSlides = 6;
function atualizarNavegacao() {
    document.getElementById('txtProgress').innerText = 'Slide ' + slideAtual + ' de ' + totalSlides;
    document.getElementById('btnPrev').disabled = false;
    document.getElementById('btnNext').innerHTML = (slideAtual === totalSlides) ? 'Módulo 2 &#9654;' : 'Avançar &#9654;';
    document.getElementById('btnNext').disabled = false;
}
function mudarSlide(direcao) {
    if (direcao === 1 && slideAtual === totalSlides) {
    window.location.href = 'apresentacao1.html';
    return;
    }
    if (direcao === -1 && slideAtual === 1) {
        window.location.href = 'index.html';
        return;
    }
    document.getElementById('s' + slideAtual).classList.remove('active');
    slideAtual += direcao;
    document.getElementById('s' + slideAtual).classList.add('active');
    atualizarNavegacao();
    if(slideAtual === 2 && typeof dadosS2 !== 'undefined' && dadosS2.length === 0) s2_Setup();
    if(slideAtual === 3 && typeof cardsS3 !== 'undefined' && cardsS3.length === 0) s3_Setup();
}
var dadosS2 = []; var transformadoS2 = false; var rawValues = [15, 45, 80, 25, 60, 90, 35, 70, 50, 10];
function s2_Setup() {
    var stage = document.getElementById('stage-s2');
    for(var i=0; i<rawValues.length; i++) {
        var item = document.createElement('div'); item.className = 'raw-data-item'; item.innerText = rawValues[i];
        var l = 5 + Math.random() * 80; var t = 5 + Math.random() * 80;
        item.style.left = l + '%'; item.style.top = t + '%';
        item.setAttribute('data-orig-l', l); item.setAttribute('data-orig-t', t);
        stage.appendChild(item); dadosS2.push(item);
    }
}
function s2_Transformar() {
    if(transformadoS2) return; transformadoS2 = true;
    document.getElementById('s2-axis-x').style.opacity = '1'; document.getElementById('s2-axis-y').style.opacity = '1';
    var sorted = rawValues.slice(); sorted.sort(function(a, b) { return a - b; });
    for(var i=0; i<dadosS2.length; i++) {
        var item = dadosS2[i]; var val = parseInt(item.innerText); var orderIndex = sorted.indexOf(val); sorted[orderIndex] = -1;
        item.style.left = (15 + (orderIndex * 8)) + '%'; item.style.top = 'auto'; item.style.bottom = '10%';
        item.style.height = (val * 0.7) + '%'; item.style.color = 'white'; item.style.backgroundColor = '#1e3a8a';
        item.style.padding = '2px 0'; item.style.display = 'flex'; item.style.alignItems = 'flex-start';
        item.style.justifyContent = 'center'; item.style.fontSize = '14px'; item.style.width = '30px';
    }
    document.getElementById('msg-s2').innerHTML = '<b>Ordem estabelecida!</b> Ao organizarmos os dados do menor para o maior diâmetro, a informação salta aos olhos: conseguimos identificar rapidamente os valores atípicos (como as peças de 10mm e 90mm) e entender a variação da produção.';
}
function s2_Resetar() {
    if(!transformadoS2) return; transformadoS2 = false;
    document.getElementById('s2-axis-x').style.opacity = '0'; document.getElementById('s2-axis-y').style.opacity = '0';
    for(var i=0; i<dadosS2.length; i++) {
        var item = dadosS2[i]; item.style.left = item.getAttribute('data-orig-l') + '%'; item.style.top = item.getAttribute('data-orig-t') + '%';
        item.style.bottom = 'auto'; item.style.height = 'auto'; item.style.color = '#475569'; item.style.backgroundColor = 'white';
        item.style.padding = '5px 10px'; item.style.fontSize = '22px'; item.style.width = 'auto';
    }
    document.getElementById('msg-s2').innerHTML = 'Estes números representam o diâmetro de eixos produzidos hoje. Assim, espalhados, é impossível saber se a produção foi boa ou ruim.';
}
var cardsS3 = [];
var cfgS3 = [
    { id: 1, txt: 'Planilha Excel', icon: '&#128202;', type: 'est' },
    { id: 2, txt: 'Foto da Peça', icon: '&#128247;', type: 'nest' },
    { id: 3, txt: 'Banco SQL', icon: '&#128452;', type: 'est' },
    { id: 4, txt: 'Áudio do Cliente', icon: '&#127897;', type: 'nest' },
    { id: 5, txt: 'E-mail SAC', icon: '&#128231;', type: 'nest' },
    { id: 6, txt: 'Tabela de Pesos', icon: '&#128203;', type: 'est' }
];
function s3_Setup() {
    var stage = document.getElementById('stage-s3');
    for(var i=0; i<cfgS3.length; i++) {
        var c = cfgS3[i]; var card = document.createElement('div'); card.className = 'data-card'; card.setAttribute('data-type', c.type);
        card.innerHTML = '<div class="card-icon">' + c.icon + '</div><div>' + c.txt + '</div>';
        stage.appendChild(card); cardsS3.push(card);
    }
    s3_Misturar();
}
function s3_Misturar() {
    for(var i=0; i<cardsS3.length; i++) {
        var card = cardsS3[i]; card.style.left = (35 + Math.random()*20) + '%'; card.style.top = (25 + Math.random()*50) + '%';
        card.style.transform = 'rotate(' + ((Math.random()*40)-20) + 'deg)'; card.style.borderColor = '#cbd5e1'; card.style.backgroundColor = 'white';
    }
    document.getElementById('msg-s3').innerHTML = 'Os dados estão misturados no servidor da empresa. Clique para classificá-los corretamente.';
}
function s3_Classificar(isEstruturado) {
    var targetType = isEstruturado ? 'est' : 'nest'; var baseLeft = isEstruturado ? 10 : 60; var count = 0;
    for(var i=0; i<cardsS3.length; i++) {
        var card = cardsS3[i]; if(card.getAttribute('data-type') === targetType) {
            card.style.left = baseLeft + (count % 2 === 0 ? 0 : 20) + '%'; card.style.top = (30 + Math.floor(count/2)*30) + '%';
            card.style.transform = 'rotate(0deg)'; card.style.borderColor = isEstruturado ? '#2563eb' : '#ea580c';
            card.style.backgroundColor = isEstruturado ? '#eff6ff' : '#fff7ed'; count++;
        }
    }
    if(isEstruturado) {
        document.getElementById('msg-s3').innerHTML = '<b>Estruturados:</b> Organizados em matrizes. São perfeitos para fórmulas do Excel e cálculos estatísticos.';
    } else {
        document.getElementById('msg-s3').innerHTML = '<b>Não Estruturados:</b> Como você calcula a média de fotos ou e-mails? Exigem classificação humana ou Inteligência Artificial.';
    }
}
var limpoS4 = false;
function s4_Limpar() {
    if(limpoS4) return; limpoS4 = true;
    document.getElementById('t-m2').innerText = 'Equipamento A'; document.getElementById('t-m2').className = 'cell-fixed';
    document.getElementById('t-temp5').innerText = '184 °C'; document.getElementById('t-temp5').className = 'cell-fixed';
    document.getElementById('t-temp3').innerText = '185 °C'; document.getElementById('t-temp3').className = 'cell-fixed';
    document.getElementById('t-stat3').innerText = 'OK'; document.getElementById('t-stat3').className = 'cell-fixed';
    document.getElementById('t-id5').innerText = 'L-1005'; document.getElementById('t-id5').className = 'cell-fixed';
    document.getElementById('msg-s4').innerHTML = '<b>Dados Limpos!</b> Valores nulos foram imputados, o sensor quebrado foi ajustado e o ID corrigido. Agora a base de dados é confiável para a análise estatística.';
    document.getElementById('msg-s4').style.borderLeftColor = '#10b981';
}
function s4_Resetar() {
    if(!limpoS4) return; limpoS4 = false;
    document.getElementById('t-m2').innerText = 'NULL'; document.getElementById('t-m2').className = 'cell-null';
    document.getElementById('t-temp5').innerText = '-'; document.getElementById('t-temp5').className = 'cell-null';
    document.getElementById('t-temp3').innerText = '9999 °C'; document.getElementById('t-temp3').className = 'cell-error';
    document.getElementById('t-stat3').innerText = 'ERRO_SENSOR'; document.getElementById('t-stat3').className = 'cell-error';
    document.getElementById('t-id5').innerText = '###'; document.getElementById('t-id5').className = 'cell-error';
    document.getElementById('msg-s4').innerHTML = '<b>Dados Sujos:</b> Faltam informações da Máquina, há uma temperatura fisicamente impossível (9999°C) e IDs corrompidos.';
    document.getElementById('msg-s4').style.borderLeftColor = '#ef4444';
}
atualizarNavegacao();
