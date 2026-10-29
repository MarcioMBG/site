/* ================= GERENCIAMENTO DE NAVEGAÇÃO ================= */
var slideAtual = 1;
var totalSlides = 6;

function atualizarNavegacao() {
    document.getElementById('txtProgress').innerText = "Slide " + slideAtual + " de " + totalSlides;
    document.getElementById('btnPrev').disabled = false;
    document.getElementById('btnPrev').innerHTML = (slideAtual === 1) ? "&#9664; Módulo 6" : "&#9664; Voltar";
    document.getElementById('btnNext').innerHTML = (slideAtual === totalSlides) ? "Módulo 8 " : "Avançar &#9654;";
}

function mudarSlide(direcao) {
    if (direcao === 1 && slideAtual === totalSlides) { 
        exibirToast("🎓 Módulo 7 Concluído! Redirecionando para o Módulo 8...");
        setTimeout(function() {
            window.location.href = 'apresentacao7.html';
        }, 1500);
        return; 
    }
    if (direcao === -1 && slideAtual === 1) { 
        window.location.href = 'apresentacao5.html'; 
        return; 
    }
    
    document.getElementById('s' + slideAtual).classList.remove('active');
    slideAtual += direcao;
    document.getElementById('s' + slideAtual).classList.add('active');
    
    atualizarNavegacao();

    // Trigger de inicialização dos slides interativos
    if(slideAtual === 1) s1_CarregarCenario('temp');
    if(slideAtual === 2) s2_Carregar('pos');
    if(slideAtual === 3) s3_Render();
    if(slideAtual === 4) s4_Render();
    if(slideAtual === 5) s5_CalcularPredicao(document.getElementById('slider-temp').value);
}

function exibirToast(msg) {
    var toast = document.getElementById('toast');
    if (!toast) return;
    toast.innerText = msg;
    toast.classList.add('show');
    setTimeout(function() { toast.classList.remove('show'); }, 3000);
}

/* ================= FUNÇÕES ESTATÍSTICAS UTILITÁRIAS ================= */
function calcEstaticaLinear(data) {
    var n = data.length;
    var sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;
    
    for (var i = 0; i < n; i++) {
        var x = data[i].x;
        var y = data[i].y;
        sumX += x;
        sumY += y;
        sumXY += (x * y);
        sumX2 += (x * x);
        sumY2 += (y * y);
    }
    
    var meanX = sumX / n;
    var meanY = sumY / n;
    
    var num = (n * sumXY) - (sumX * sumY);
    var denX = (n * sumX2) - (sumX * sumX);
    var denY = (n * sumY2) - (sumY * sumY);
    
    var b = num / denX;
    var a = meanY - (b * meanX);
    var r = num / Math.sqrt(denX * denY);
    var r2 = r * r;
    
    return { a: a, b: b, r: r, r2: r2, meanX: meanX, meanY: meanY, n: n };
}

/* Helper para desenhar SVG Scatter Plot com eixos */
function renderizarSVG(svgId, data, reg, bounds, options) {
    options = options || {};
    var svg = document.getElementById(svgId);
    svg.innerHTML = ''; // Limpa o SVG

    var W = 500, H = 280, pad = 40;

    // Bounds automático se não fornecido
    if(!bounds) {
        var xs = data.map(function(p){return p.x;});
        var ys = data.map(function(p){return p.y;});
        bounds = {
            minX: Math.min.apply(null, xs) - 5,
            maxX: Math.max.apply(null, xs) + 5,
            minY: Math.min.apply(null, ys) - 2,
            maxY: Math.max.apply(null, ys) + 2
        };
    }

    function mapX(x) { return pad + ((x - bounds.minX) / (bounds.maxX - bounds.minX)) * (W - 2 * pad); }
    function mapY(y) { return H - pad - ((y - bounds.minY) / (bounds.maxY - bounds.minY)) * (H - 2 * pad); }

    // Grid lines
    for(var g = 0; g <= 4; g++) {
        var gx = bounds.minX + g * (bounds.maxX - bounds.minX) / 4;
        var gy = bounds.minY + g * (bounds.maxY - bounds.minY) / 4;
        
        var px = mapX(gx);
        var py = mapY(gy);

        // Vertical grid line
        var lineV = document.createElementNS("http://www.w3.org/2000/svg", "line");
        lineV.setAttribute("x1", px); lineV.setAttribute("y1", pad);
        lineV.setAttribute("x2", px); lineV.setAttribute("y2", H - pad);
        lineV.setAttribute("class", "grid-line");
        svg.appendChild(lineV);

        // Horizontal grid line
        var lineH = document.createElementNS("http://www.w3.org/2000/svg", "line");
        lineH.setAttribute("x1", pad); lineH.setAttribute("y1", py);
        lineH.setAttribute("x2", W - pad); lineH.setAttribute("y2", py);
        lineH.setAttribute("class", "grid-line");
        svg.appendChild(lineH);

        // Axis ticks labels
        var textX = document.createElementNS("http://www.w3.org/2000/svg", "text");
        textX.setAttribute("x", px); textX.setAttribute("y", H - pad + 18);
        textX.setAttribute("text-anchor", "middle"); textX.setAttribute("class", "axis-text");
        textX.textContent = gx.toFixed(0);
        svg.appendChild(textX);

        var textY = document.createElementNS("http://www.w3.org/2000/svg", "text");
        textY.setAttribute("x", pad - 8); textY.setAttribute("y", py + 4);
        textY.setAttribute("text-anchor", "end"); textY.setAttribute("class", "axis-text");
        textY.textContent = gy.toFixed(1);
        svg.appendChild(textY);
    }

    // Eixos Principais
    var axisX = document.createElementNS("http://www.w3.org/2000/svg", "line");
    axisX.setAttribute("x1", pad); axisX.setAttribute("y1", H - pad);
    axisX.setAttribute("x2", W - pad); axisX.setAttribute("y2", H - pad);
    axisX.setAttribute("class", "axis-line");
    svg.appendChild(axisX);

    var axisY = document.createElementNS("http://www.w3.org/2000/svg", "line");
    axisY.setAttribute("x1", pad); axisY.setAttribute("y1", pad);
    axisY.setAttribute("x2", pad); axisY.setAttribute("y2", H - pad);
    axisY.setAttribute("class", "axis-line");
    svg.appendChild(axisY);

    // Banda de Confiança (opcional)
    if(options.showBand && reg) {
        var pathBand = "M ";
        for(var bx = bounds.minX; bx <= bounds.maxX; bx += (bounds.maxX - bounds.minX)/20) {
            var predY = reg.a + reg.b * bx + 0.3;
            pathBand += mapX(bx) + " " + mapY(predY) + " L ";
        }
        for(var bx2 = bounds.maxX; bx2 >= bounds.minX; bx2 -= (bounds.maxX - bounds.minX)/20) {
            var predY2 = reg.a + reg.b * bx2 - 0.3;
            pathBand += mapX(bx2) + " " + mapY(predY2) + " L ";
        }
        pathBand += "Z";

        var bandEl = document.createElementNS("http://www.w3.org/2000/svg", "path");
        bandEl.setAttribute("d", pathBand);
        bandEl.setAttribute("class", "confidence-band");
        svg.appendChild(bandEl);
    }

    // Reta de Regressão (se houver)
    if(reg) {
        var x1 = bounds.minX;
        var y1 = reg.a + reg.b * x1;
        var x2 = bounds.maxX;
        var y2 = reg.a + reg.b * x2;

        var lineTrend = document.createElementNS("http://www.w3.org/2000/svg", "line");
        lineTrend.setAttribute("x1", mapX(x1)); lineTrend.setAttribute("y1", mapY(y1));
        lineTrend.setAttribute("x2", mapX(x2)); lineTrend.setAttribute("y2", mapY(y2));
        lineTrend.setAttribute("class", options.isOutlierLine ? "trend-line-outlier" : "trend-line");
        svg.appendChild(lineTrend);
    }

    // Pontos do Scatter Plot
    data.forEach(function(pt) {
        var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", mapX(pt.x));
        circle.setAttribute("cy", mapY(pt.y));
        circle.setAttribute("r", pt.isOutlier ? "7" : "5");
        circle.setAttribute("class", pt.isOutlier ? "outlier-point" : "scatter-point");
        
        var title = document.createElementNS("http://www.w3.org/2000/svg", "title");
        title.textContent = "X: " + pt.x.toFixed(1) + ", Y: " + pt.y.toFixed(2);
        circle.appendChild(title);

        svg.appendChild(circle);
    });

    // Ponto Destacado de Predição (se houver)
    if(options.highlightPt) {
        var hx = mapX(options.highlightPt.x);
        var hy = mapY(options.highlightPt.y);

        // Guia vertical
        var vGuide = document.createElementNS("http://www.w3.org/2000/svg", "line");
        vGuide.setAttribute("x1", hx); vGuide.setAttribute("y1", H - pad);
        vGuide.setAttribute("x2", hx); vGuide.setAttribute("y2", hy);
        vGuide.setAttribute("stroke", "#2563eb"); vGuide.setAttribute("stroke-dasharray", "4,4");
        svg.appendChild(vGuide);

        var hCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        hCircle.setAttribute("cx", hx); hCircle.setAttribute("cy", hy);
        hCircle.setAttribute("r", "8"); hCircle.setAttribute("fill", "#10b981");
        hCircle.setAttribute("stroke", "#ffffff"); hCircle.setAttribute("stroke-width", "3");
        svg.appendChild(hCircle);
    }
}

/* ================= LÓGICA DO SLIDE 1 ================= */
function s1_CarregarCenario(tipo) {
    var data = [];
    var msg = "";

    if(tipo === 'temp') {
        for(var i=150; i<=220; i+=5) {
            data.push({ x: i, y: 28 + 0.12 * i + (Math.random()*1.2 - 0.6) });
        }
        msg = "<b>Cenário Ideal:</b> À medida que a Temperatura (°C) da máquina sobe, o diâmetro da peça (mm) se expande de forma previsível.";
    } else if (tipo === 'corte') {
        for(var j=10; j<=100; j+=6) {
            data.push({ x: j, y: 100 - 0.7 * j + (Math.random()*4 - 2) });
        }
        msg = "<b>Cenário Inverso:</b> Maior velocidade de corte reduz drasticamente a vida útil da ferramenta (Horas de Uso).";
    } else {
        for(var k=8; k<=18; k+=0.8) {
            data.push({ x: k, y: 50 + (Math.random()*4 - 2) });
        }
        msg = "<b>Ausência de Relação:</b> A hora do dia da medição não tem qualquer impacto sobre a dimensão produzida.";
    }

    renderizarSVG('svg-s1', data, null, null);
    document.getElementById('msg-s1').innerHTML = msg;
}

/* ================= LÓGICA DO SLIDE 2 ================= */
function s2_Carregar(tipo) {
    var data = [];
    var txtR = document.getElementById('txt-s2-r');
    var txtClass = document.getElementById('txt-s2-class');
    var msg = document.getElementById('msg-s2');

    if(tipo === 'pos') {
        for(var x=10; x<=50; x+=2) data.push({ x: x, y: 20 + 0.8*x + (Math.random()*2 - 1) });
    } else if(tipo === 'neg') {
        for(var x2=10; x2<=50; x2+=2) data.push({ x2: x2, x: x2, y: 80 - 1.1*x2 + (Math.random()*3 - 1.5) });
    } else if(tipo === 'nula') {
        for(var x3=10; x3<=50; x3+=2) data.push({ x3: x3, x: x3, y: 40 + (Math.random()*20 - 10) });
    } else if(tipo === 'curva') {
        for(var x4=10; x4<=50; x4+=2) {
            var diff = x4 - 30;
            data.push({ x: x4, y: 20 + (diff*diff)/15 + (Math.random()*1.5 - 0.75) });
        }
    }

    var stats = calcEstaticaLinear(data);
    renderizarSVG('svg-s2', data, null, null);

    var rVal = stats.r;
    txtR.innerText = (rVal >= 0 ? "+" : "") + rVal.toFixed(2);

    if(tipo === 'pos') {
        txtR.className = "big-number text-green";
        txtClass.innerText = "Forte Correlação Positiva (+0.95 a +1.00)";
        msg.innerHTML = "<b>Positiva Forte:</b> Quando X cresce, Y cresce de forma diretamente proporcional.";
    } else if(tipo === 'neg') {
        txtR.className = "big-number text-red";
        txtClass.innerText = "Forte Correlação Negativa (-0.90 a -1.00)";
        msg.innerHTML = "<b>Negativa Forte:</b> Quando X cresce, Y diminui de forma inversamente proporcional.";
    } else if(tipo === 'nula') {
        txtR.className = "big-number text-amber-500";
        txtClass.innerText = "Correlação Praticamente Nula (r ≈ 0)";
        msg.innerHTML = "<b>Ausência de Relação Linear:</b> Pontos dispersos em nuvem sem direção definida.";
    } else {
        txtR.className = "big-number text-purple-600";
        txtClass.innerText = "Não Linear (Pearson Falha!)";
        msg.innerHTML = "<b>Alerta de Cautela:</b> Existe uma forte relação física (parábola), mas como ela é curvilínea, o cálculo de Pearson é enganoso e indica quase zero!";
    }
}

/* ================= LÓGICA DO SLIDE 3 ================= */
var s3_dataBase = [
    {x: 160, y: 47.1}, {x: 165, y: 47.8}, {x: 170, y: 48.3}, {x: 175, y: 49.0},
    {x: 180, y: 49.6}, {x: 185, y: 50.3}, {x: 190, y: 50.9}, {x: 195, y: 51.5},
    {x: 200, y: 52.2}, {x: 205, y: 52.8}, {x: 210, y: 53.4}
];

function s3_Render() {
    var stats = calcEstaticaLinear(s3_dataBase);
    renderizarSVG('svg-s3', s3_dataBase, stats, {minX: 150, maxX: 220, minY: 45, maxY: 55});

    document.getElementById('txt-s3-b').innerText = stats.b.toFixed(3);
    document.getElementById('txt-s3-a').innerText = stats.a.toFixed(2);
    document.getElementById('txt-s3-r2').innerText = (stats.r2 * 100).toFixed(1) + "%";
}

function s3_AdicionarRuido() {
    s3_dataBase = s3_dataBase.map(function(pt) {
        return { x: pt.x, y: pt.y + (Math.random() * 0.8 - 0.4) };
    });
    s3_Render();
}

function s3_Reset() {
    s3_dataBase = [
        {x: 160, y: 47.1}, {x: 165, y: 47.8}, {x: 170, y: 48.3}, {x: 175, y: 49.0},
        {x: 180, y: 49.6}, {x: 185, y: 50.3}, {x: 190, y: 50.9}, {x: 195, y: 51.5},
        {x: 200, y: 52.2}, {x: 205, y: 52.8}, {x: 210, y: 53.4}
    ];
    s3_Render();
}

/* ================= LÓGICA DO SLIDE 4 ================= */
var s4_hasOutlier = true;
function s4_Render() {
    var cleanData = [
        {x: 160, y: 47.1}, {x: 168, y: 48.0}, {x: 175, y: 49.0},
        {x: 182, y: 49.8}, {x: 190, y: 50.8}, {x: 198, y: 51.9}, {x: 205, y: 52.7}
    ];

    var dirtyData = cleanData.slice();
    if(s4_hasOutlier) {
        dirtyData.push({x: 205, y: 42.0, isOutlier: true}); // Outlier severo
    }

    var cleanStats = calcEstaticaLinear(cleanData);
    var dirtyStats = calcEstaticaLinear(dirtyData);

    renderizarSVG('svg-s4', dirtyData, dirtyStats, {minX: 150, maxX: 220, minY: 40, maxY: 55}, {
        isOutlierLine: s4_hasOutlier
    });

    document.getElementById('txt-s4-r2-clean').innerText = (cleanStats.r2 * 100).toFixed(1) + "%";
    document.getElementById('txt-s4-r2-dirty').innerText = s4_hasOutlier ? (dirtyStats.r2 * 100).toFixed(1) + "%" : "N/A (Limpo)";
    
    var shift = ((dirtyStats.b - cleanStats.b) / cleanStats.b) * 100;
    document.getElementById('txt-s4-slope-shift').innerText = s4_hasOutlier ? (shift >= 0 ? "+" : "") + shift.toFixed(0) + "%" : "0%";

    var btn = document.getElementById('btn-toggle-outlier');
    if(s4_hasOutlier) {
        btn.style.background = "#10b981";
        btn.innerText = "🧹 Remover Outlier Discrepante";
    } else {
        btn.style.background = "#ef4444";
        btn.innerText = "🚨 Injetar Outlier Discrepante";
    }
}

function s4_ToggleOutlier() {
    s4_hasOutlier = !s4_hasOutlier;
    s4_Render();
}

/* ================= LÓGICA DO SLIDE 5 ================= */
function s5_CalcularPredicao(temp) {
    var tempNum = parseFloat(temp);
    document.getElementById('txt-s5-xval').innerText = tempNum.toFixed(0) + " °C";

    var a = 32.5;
    var b = 0.096;
    var yPred = a + b * tempNum;
    var margem = 0.31;

    document.getElementById('txt-s5-yval').innerText = yPred.toFixed(2) + " mm";
    document.getElementById('txt-s5-ic').innerText = (yPred - margem).toFixed(2) + " mm a " + (yPred + margem).toFixed(2) + " mm";

    var simData = [
        {x: 150, y: 46.9}, {x: 160, y: 47.8}, {x: 170, y: 48.8},
        {x: 180, y: 49.8}, {x: 190, y: 50.7}, {x: 200, y: 51.7}, {x: 210, y: 52.6}, {x: 220, y: 53.6}
    ];
    var reg = { a: a, b: b };

    renderizarSVG('svg-s5', simData, reg, {minX: 145, maxX: 225, minY: 45, maxY: 55}, {
        showBand: true,
        highlightPt: { x: tempNum, y: yPred }
    });
}

/* ================= INICIALIZAÇÃO INICIAL ================= */
window.onload = function() {
    atualizarNavegacao();
    s1_CarregarCenario('temp');
};