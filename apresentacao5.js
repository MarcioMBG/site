var slideAtual = 1;
var totalSlides = 7; 

function atualizarNavegacao() {
    document.getElementById('txtProgress').innerText = "Slide " + slideAtual + " de " + totalSlides;
    document.getElementById('btnPrev').disabled = false;
    document.getElementById('btnPrev').innerHTML = (slideAtual === 1) ? "&#9664; Módulo 5" : "&#9664; Voltar";
    document.getElementById('btnNext').innerHTML = (slideAtual === totalSlides) ? "Finalizar Curso" : "Avançar &#9654;";
}

function mudarSlide(direcao) {
    if (direcao === 1 && slideAtual === totalSlides) { 
        alert("Parabéns! Concluiu o curso 'Aprendendo Qualidade no VBA Excel'.");
        return; 
    }
    if (direcao === -1 && slideAtual === 1) { 
        window.location.href = 'apresentacao4.html'; 
        return; 
    }
    
    document.getElementById('s' + slideAtual).classList.remove('active');
    slideAtual += direcao;
    document.getElementById('s' + slideAtual).classList.add('active');
    
    atualizarNavegacao();

    if(slideAtual === 2 && s2_data.length === 0) s2_Reset();
    if(slideAtual === 5 && we_init === false) { we_init = true; s5_DrawRule(1); }
    if(slideAtual === 6 && nelson_init === false) { nelson_init = true; s6_DrawRule(3); }
}

var we_init = false;
var nelson_init = false;

function renderControlChart(groupId, dataArray, alertIndices) {
    var group = document.getElementById(groupId);
    while (group.firstChild) { group.removeChild(group.firstChild); }
    
    if(dataArray.length === 0) return;

    var stepX = 520 / (dataArray.length > 1 ? dataArray.length - 1 : 1);
    
    var pointsStr = "";
    for(var i=0; i<dataArray.length; i++) {
        var x = 40 + (i * stepX);
        var y = dataArray[i]; 
        pointsStr += x + "," + y + " ";
    }
    
    var poly = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    poly.setAttribute("points", pointsStr);
    poly.setAttribute("class", "plot-line");
    group.appendChild(poly);

    for(var j=0; j<dataArray.length; j++) {
        var cx = 40 + (j * stepX);
        var cy = dataArray[j];
        var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", cx);
        circle.setAttribute("cy", cy);
        circle.setAttribute("r", "5");
        
        var isAlert = false;
        for(var k=0; k<alertIndices.length; k++) {
            if(alertIndices[k] === j) isAlert = true;
        }
        
        if(isAlert) {
            circle.setAttribute("class", "plot-point alert");
        } else {
            circle.setAttribute("class", "plot-point");
        }
        group.appendChild(circle);
    }
}

var s2_data = [];
var s2_alerts = [];

function s2_Add(isEspecial) {
    if(s2_data.length >= 15) {
        s2_data.shift(); 
        var novosAlertas = [];
        for(var i=0; i<s2_alerts.length; i++) {
            if(s2_alerts[i] > 0) novosAlertas.push(s2_alerts[i] - 1);
        }
        s2_alerts = novosAlertas;
    }

    var y;
    if(isEspecial) {
        y = Math.random() > 0.5 ? 20 + Math.random()*10 : 230 + Math.random()*10;
        s2_data.push(y);
        s2_alerts.push(s2_data.length - 1);
        document.getElementById('msg-s2').innerHTML = "<b style='color:#ef4444;'>Alarme! Ponto Fora do LSC/LIC.</b> Algo excepcional quebrou a estabilidade.";
    } else {
        y = 130 + (Math.random() * 70 - 35);
        s2_data.push(y);
        document.getElementById('msg-s2').innerHTML = "O processo está rodando com variação natural (Causas Comuns). A curva sobe e desce, mas nunca passa dos Limites.";
    }

    renderControlChart("plot-s2-group", s2_data, s2_alerts);
}

function s2_Reset() {
    s2_data = [130, 110, 140, 135];
    s2_alerts = [];
    document.getElementById('msg-s2').innerText = "O processo está rodando com variação natural (Causas Comuns). A curva sobe e desce, mas nunca passa dos Limites.";
    renderControlChart("plot-s2-group", s2_data, s2_alerts);
}

var we_dataset = {
    1: { dados: [130, 120, 140, 135, 110, 80, 20], alertas: [6], msg: "<b>Regra 1 Detectada:</b> O último ponto estourou o LSC (passou da linha vermelha tracejada dos 3 Sigmas)." },
    2: { dados: [130, 140, 130, 50, 100, 60], alertas: [3, 5], msg: "<b>Regra 2 Detectada:</b> O limite máximo (LSC) ainda não foi rompido! Mas 2 dos últimos 3 pontos invadiram a Zona A (faixa amarela / 2 Sigmas)." },
    3: { dados: [130, 140, 110, 95, 85, 120, 90, 80], alertas: [3, 4, 6, 7], msg: "<b>Regra 3 Detectada:</b> 4 dos últimos 5 pontos estão na Zona B ou além. A média da máquina claramente sofreu um solavanco." },
    4: { dados: [140, 120, 130, 110, 125, 105, 115, 120, 100], alertas: [1,2,3,4,5,6,7,8], msg: "<b>Regra 4 Detectada:</b> Tendência! 8 pontos consecutivos acima da Linha Central. Não rompeu LSC, mas indica desgaste de ferramenta." }
};

function s5_DrawRule(num) {
    renderControlChart("plot-we-group", we_dataset[num].dados, we_dataset[num].alertas);
    document.getElementById('msg-we').innerHTML = we_dataset[num].msg;
}

var nelson_dataset = {
    3: { 
        dados: [160, 145, 130, 115, 100, 85], 
        alertas: [0,1,2,3,4,5], 
        msg: "<b>Regra 3 Detectada:</b> 6 pontos seguidos subindo ou descendo. A máquina não explodiu o limite, mas a tendência contínua avisa que uma falha grave ocorrerá em breve se nada for feito." 
    },
    4: { 
        dados: [110, 150, 115, 145, 120, 140, 115, 145, 120, 140, 110, 150, 115, 145], 
        alertas: [0,1,2,3,4,5,6,7,8,9,10,11,12,13], 
        msg: "<b>Regra 4 Detectada:</b> 14 pontos alternando (zigue-zague). Isso geralmente acusa <i>'Sobrecontrole'</i>. É quando o operador inexperiente mexe na máquina a cada peça produzida tentando compensar o erro." 
    },
    7: { 
        dados: [130, 125, 135, 128, 132, 127, 133, 129, 131, 126, 134, 130, 128, 132, 127], 
        alertas: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14], 
        msg: "<b>Regra 7 Detectada:</b> 15 pontos grudados na linha central (dentro da Zona C). O processo parece 'perfeito', mas essa ausência total de variação natural indica que o instrumento de medição travou ou os dados foram fraudados." 
    },
    8: { 
        dados: [90, 85, 175, 170, 95, 90, 165, 180], 
        alertas: [0,1,2,3,4,5,6,7], 
        msg: "<b>Regra 8 Detectada:</b> 8 pontos consecutivos <i>fora</i> da zona C (±1 Sigma), pulando do vermelho/amarelo de baixo direto pro vermelho/amarelo de cima. Indica mistura de dois lotes ou dois operadores trabalhando em paralelos diferentes." 
    }
};

function s6_DrawRule(num) {
    renderControlChart("plot-nelson-group", nelson_dataset[num].dados, nelson_dataset[num].alertas);
    document.getElementById('msg-nelson').innerHTML = nelson_dataset[num].msg;
}

atualizarNavegacao();

document.addEventListener('click', function() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(function(erro) {
            console.log("O ecrã inteiro foi bloqueado: " + erro.message);
        });
    }
}, { once: true });