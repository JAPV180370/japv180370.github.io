// --- VARIABLES GLOBALES ---
let currentIdx = 0; 
let score = 0; 
let failedVectors = []; 
let startTime; 
let userAlias = "";
let isAnswering = false; 
let questionStartTime;
let quizFinished = false; // controla si el quiz terminó

// --- OBJETOS PARA ANALÍTICA ---
let sessionAnalytics = {
    timesPerQuestion: [],
    failedIds: {}
};

// --- LOCALSTORAGE ---
function saveUserResult(alias, s, t) {
    let lb = JSON.parse(localStorage.getItem('phishing_ranking')) || [];
    lb.push({ alias: alias, score: s, time: t, date: new Date().toLocaleDateString() });
    lb.sort((a, b) => b.score - a.score || a.time - b.time);
    localStorage.setItem('phishing_ranking', JSON.stringify(lb.slice(0, 10)));
}

function renderLeaderboard() {
    const data = JSON.parse(localStorage.getItem('phishing_ranking')) || [];
    const list = document.getElementById('ranking-list');
    if(list) {
        list.innerHTML = data.map((u, i) => `
            <tr>
                <td>${i + 1}</td>
                <td style="text-align:left;">${u.alias}</td>
                <td><b>${u.score}/${scenarios.length}</b></td>
                <td>${u.time}s</td>
            </tr>`).join('');
    }
}

// --- MOTOR DE PREGUNTAS ---
function renderScenario() {
    isAnswering = false;
    const s = scenarios[currentIdx];
    questionStartTime = Date.now();

    document.getElementById('step-title').innerText = `Caso ${currentIdx + 1} de ${scenarios.length}`;
    document.getElementById('live-points').innerText = `Puntos: ${score}`;

    let content = s.image ? `<center><img src="${s.image}" style="max-width:75%; border-radius:8px; margin-bottom:15px;"></center>` : "";
    document.getElementById('scenario-text').innerHTML = content + s.text;
    document.getElementById('feedback-message').style.display = 'none';
    document.getElementById('quiz-buttons').style.display = 'flex';
}

function checkAnswer(choice) {
    if(isAnswering) return;
    isAnswering = true;

    const s = scenarios[currentIdx];
    const timeTaken = (Date.now() - questionStartTime) / 1000;
    sessionAnalytics.timesPerQuestion.push(timeTaken);

    const isCorrect = (choice === s.isPhishing);

    if(isCorrect) {
        score++;
    } else {
        failedVectors.push(s.vector);
        sessionAnalytics.failedIds[s.id] = (sessionAnalytics.failedIds[s.id] || 0) + 1;
    }

    const fb = document.getElementById('feedback-message');
    fb.style.display = 'block';
    fb.style.backgroundColor = isCorrect ? '#e6f4ea' : '#fce8e6';
    fb.style.color = isCorrect ? '#1e7e34' : '#c5221f';
    fb.innerHTML = `<h3><strong>${isCorrect ? '¡Correcto!' : '¡Incorrecto!'}</strong></h3><br>${s.desc}`;

    document.getElementById('quiz-buttons').style.display = 'none';

    const btnNext = document.getElementById("btnSiguiente");
    btnNext.style.display = "block";
    btnNext.innerText = (currentIdx === scenarios.length - 1) ? "Ver resultados" : "Siguiente";
    btnNext.disabled = true;
    setTimeout(() => btnNext.disabled = false, 1000);

    btnNext.onclick = () => {
        btnNext.style.display = "none";
        currentIdx++;
        (currentIdx < scenarios.length) ? renderScenario() : showFinalResults();
    };
}

function showFinalResults() {
    quizFinished = true;

    const totalTime = Math.round((Date.now() - startTime) / 1000);
    const avgTime = (sessionAnalytics.timesPerQuestion.reduce((a,b) => a+b, 0) / scenarios.length).toFixed(1);

    let trendText = "Sin errores significativos.";
    if (failedVectors.length > 0) {
        const counts = failedVectors.reduce((a, b) => ({...a, [b]: (a[b] || 0) + 1}), {});
        const worstVector = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
        trendText = `Vulnerable a: <b>${worstVector}</b>`;
    }

    let worstId = Object.keys(sessionAnalytics.failedIds).reduce((a, b) => 
        sessionAnalytics.failedIds[a] > sessionAnalytics.failedIds[b] ? a : b, "Ninguno");

    saveUserResult(userAlias, score, totalTime);

    document.getElementById('quiz-engine').style.display = 'none';
    document.getElementById('final-score').style.display = 'block';
	document.getElementById('btn-post-quiz').style.display = 'flex';
    renderLeaderboard();

    document.getElementById('percentage').innerText = `${score}/${scenarios.length}`;
    document.getElementById('evaluation-text').innerHTML = `
        <div style="background: #fdfbff; border: 1px solid #6c1f55; padding: 15px; border-radius: 10px; text-align: left; margin-top: 15px;">
            <p><i class="fas fa-chart-line"></i> <b>Tendencia:</b> ${trendText}</p>
            <p><i class="fas fa-exclamation-triangle"></i> <b>Escenario Crítico:</b> #${worstId}</p>
            <p><i class="fas fa-clock"></i> <b>Tiempo promedio:</b> ${avgTime}s por pregunta</p>
            <p><i class="fas fa-hourglass-half"></i> <b>Tiempo:</b> ${totalTime}s</p>
        </div>
    `;
}

// --- CONTROLES ---
window.startQuiz = function() {
    userAlias = document.getElementById('user-alias').value.trim();
    if (!userAlias) { alert("No se puede dejar el campo vacío."); return; }

    currentIdx = 0; score = 0; failedVectors = [];
    sessionAnalytics.timesPerQuestion = [];
    sessionAnalytics.failedIds = {};
    startTime = Date.now();

    document.getElementById('quiz-intro').style.display = 'none';
    document.getElementById('final-score').style.display = 'none';
    document.getElementById('quiz-engine').style.display = 'block';
    renderScenario();
};

window.jumpToRanking = function() {
    document.getElementById('quiz-intro').style.display = 'none';
    document.getElementById('final-score').style.display = 'block';
    document.getElementById('btn-volver-consulta').style.display = 'block';
    document.getElementById('btn-post-quiz').style.display = 'none';
    renderLeaderboard();
};

window.restartQuiz = function() { window.location.reload(); };
window.goBackToIntro = function() { window.location.reload(); };
