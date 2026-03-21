// --- VARIABLES GLOBALES ---
let currentIdx = 0; 
let score = 0; 
let startTime; 
let userAlias = "";
let isAnswering = false; 
let questionStartTime;
let quizFinished = false;

// --- OBJETOS PARA ANALÍTICA POR SESIÓN ---
let sessionAnalytics = {
    timesPerQuestion: [],
    failedVectors: [],
    failedIds: {}
};

// --- SCOREBOARD CON MINUTOS ---
function secondsToMinutes(segundos) {
    return (segundos / 60).toFixed(2);
}

// --- CALCULAR TIEMPO TOTAL Y PROMEDIO ---
function getQuizTimes(startTime, endTime, totalQuestions) {
    const totalTime = Math.round((endTime - startTime) / 1000);
    const avgTime = totalQuestions > 0 ? (totalTime / totalQuestions).toFixed(1) : 0;
    return { totalTime, avgTime };
}

// --- GUARDAR RESULTADOS EN LOCALSTORAGE ---
function saveUserResult(alias, score, totalTime) {
    let lb = JSON.parse(localStorage.getItem('phishing_ranking')) || [];
    lb.push({ 
        alias: alias, 
        score: score, 
        time: totalTime, 
        date: new Date().toLocaleDateString(),
        failedVectors: sessionAnalytics.failedVectors,
        failedIds: sessionAnalytics.failedIds,
        totalQuestions: scenarios.length
    });
    lb.sort((a,b) => b.score - a.score || a.time - b.time);
    localStorage.setItem('phishing_ranking', JSON.stringify(lb.slice(0, 10)));
}

// --- CALCULAR ESTADÍSTICAS DESDE SCOREBOARD ---
function calculateStatsFromScoreboard(alias) {
    const lb = JSON.parse(localStorage.getItem('phishing_ranking')) || [];
    const userAttempts = lb.filter(u => u.alias === alias);
    if (!userAttempts.length) return null;

    let totalTime = 0;
    let failedVectorsCount = {};
    let failedIdsCount = {};
    let totalQuestions = userAttempts[0].totalQuestions || 0;

    userAttempts.forEach(attempt => {
        totalTime += attempt.time || 0;
        if (attempt.failedVectors) attempt.failedVectors.forEach(v => failedVectorsCount[v] = (failedVectorsCount[v] || 0) + 1);
        if (attempt.failedIds) for (const id in attempt.failedIds) failedIdsCount[id] = (failedIdsCount[id] || 0) + attempt.failedIds[id];
    });

    // Tendencia
    let trendText = "N/A";
    const vectorsKeys = Object.keys(failedVectorsCount);
    if (vectorsKeys.length) {
        const worstVector = vectorsKeys.reduce((a,b) => failedVectorsCount[a] > failedVectorsCount[b] ? a : b);
        trendText = `${worstVector}`;
    }

    // Escenario crítico
    let worstId = "N/A";
    const failedIdsKeys = Object.keys(failedIdsCount);
    if (failedIdsKeys.length) {
        worstId = failedIdsKeys.reduce((a,b) => failedIdsCount[a] > failedIdsCount[b] ? a : b);
    }

    const avgTime = (totalTime / userAttempts.length).toFixed(1);

    return { trendText, worstId, totalTime, avgTime };
}

// --- ACTUALIZAR TABLA DE ESTADÍSTICAS DEL USUARIO ---
function updateUserStatsTable(alias) {
    const stats = calculateStatsFromScoreboard(alias);
    const userStatsBody = document.getElementById('user-stats');
    if (!userStatsBody || !stats) return;

    userStatsBody.innerHTML = `
        <tr>
            <td style="text-align: center;">${stats.trendText}</td>
            <td style="text-align: center;">#${stats.worstId}</td>
            <td style="text-align: center;">${stats.avgTime}s</td>
            <td style="text-align: center;">${stats.totalTime}s</td>
        </tr>
    `;
}

// --- RENDERIZAR RANKING ---
function renderLeaderboard() {
    const data = JSON.parse(localStorage.getItem('phishing_ranking')) || [];
    const list = document.getElementById('ranking-list');
    if(list) {
        list.innerHTML = data.map((u, i) => {
            let medal = "";
            if (i === 0) medal = "🥇";
            else if (i === 1) medal = "🥈";
            else if (i === 2) medal = "🥉";
            return `
            <tr>
                <td style="text-align: center; font-weight: bold;">${medal} ${i + 1}</td>
                <td style="text-align: center;">${u.alias}</td>
                <td style="text-align: center;">${u.score} / ${scenarios.length} pts</td>
                <td style="text-align: center;">${secondsToMinutes(u.time)} min</td>
            </tr>`;
        }).join('');
    }
}

// --- RENDERIZAR ESCENARIO ---
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

    let progress = ((currentIdx + 1) / scenarios.length) * 100;
    document.getElementById('progress-bar').style.width = `${progress}%`;
}

// --- REVISAR RESPUESTA ---
function checkAnswer(choice) {
    if(isAnswering) return;
    isAnswering = true;

    const s = scenarios[currentIdx];
    const timeTaken = (Date.now() - questionStartTime) / 1000;
    sessionAnalytics.timesPerQuestion.push(timeTaken);

    const isCorrect = (choice === s.isPhishing);
    if(!isCorrect){
        sessionAnalytics.failedVectors.push(s.vector);
        sessionAnalytics.failedIds[s.id] = (sessionAnalytics.failedIds[s.id] || 0) + 1;
    } else score++;

    document.getElementById('live-points').innerText = `Puntos: ${score}`;

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

// --- MOSTRAR RESULTADOS ---
function showFinalResults() {
    quizFinished = true;

    const { totalTime, avgTime } = getQuizTimes(startTime, Date.now(), scenarios.length);
    saveUserResult(userAlias, score, totalTime);

    // Mostrar secciones
    document.getElementById('quiz-engine').style.display = 'none';
    document.getElementById('final-score').style.display = 'block';
    document.getElementById('btn-back-to-intro').style.display = 'flex';

    renderLeaderboard();

    // Analítica en texto
    const stats = calculateStatsFromScoreboard(userAlias);
    if(stats){
        document.getElementById('evaluation-text').innerHTML = `
            <div style="margin: 15px 0; padding: 15px; border-radius: 10px; text-align: left;">
				<p>• <b>Punto débil:</b> <span style="margin-left: 5px;">${stats.trendText}</span></p>
				<p>• <b>Peor escenario:</b> <span style="margin-left: 5px;">#${stats.worstId}</span></p>
				<p>• <b>Tiempo promedio:</b> <span style="margin-left: 5px;">${stats.avgTime}s</span></p>
				<p>• <b>Duración total:</b> <span style="margin-left: 5px;">${stats.totalTime}s</span></p>
			</div>
        `;
    }

    // Tabla de estadísticas del usuario
    updateUserStatsTable(userAlias);
}

// --- CONTROLES ---
window.startQuiz = function() {
    userAlias = document.getElementById('user-alias').value.trim();
    if(!userAlias){ alert("No se puede dejar el campo vacío."); return; }

    let lb = JSON.parse(localStorage.getItem('phishing_ranking')) || [];
    const existing = lb.find(u => u.alias === userAlias);
    if(existing){
        if(!confirm(`Ya existe un intento de "${userAlias}" con ${existing.score} pts.\n¿Deseas borrar y reiniciar?`)) return;
        lb = lb.filter(u => u.alias !== userAlias);
        localStorage.setItem('phishing_ranking', JSON.stringify(lb));
    }

    currentIdx = 0;
    score = 0;
    sessionAnalytics.timesPerQuestion = [];
    sessionAnalytics.failedVectors = [];
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
    document.getElementById('btn-back-to-intro').style.display = 'block';
    renderLeaderboard();
    updateUserStatsTable(userAlias);
};

window.restartQuiz = window.goBackToIntro = function() { window.location.reload(); };
