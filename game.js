const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Экран өлчөмүн толтуруу
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Менюларды башкаруу функциялары
function showLevels() {
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('level-menu').style.display = 'flex';
}

function backToMenu() {
    document.getElementById('level-menu').style.display = 'none';
    document.getElementById('main-menu').style.display = 'flex';
}

function startLevel(level) {
    document.getElementById('level-menu').style.display = 'none';
    document.getElementById('game-ui').style.display = 'block';
    
    if(level === 1) {
        initLevel1(); // 1-деңгээлди иштетүү
    }
}

// --- 1-ДЕҢГЭЭЛДИН ЛОГИКАСЫ (Гравитация) ---
let earth = { x: canvas.width / 2, y: canvas.height / 2, radius: 50 };
let sat = { x: canvas.width / 2, y: canvas.height / 2 - 150, radius: 10, vx: 3, vy: 0 };
const G = 0.5; // Оюн үчүн туруктуу гравитация күчү

function initLevel1() {
    gameLoop();
}

function gameLoop() {
    // Фонду тазалоо
    ctx.fillStyle = '#020205';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 1. Физикалык эсептөөлөр (Ньютондун мыйзамы)
    let dx = earth.x - sat.x;
    let dy = earth.y - sat.y;
    let distance = Math.sqrt(dx*dx + dy*dy);
    let force = (G * earth.radius) / (distance * distance);
    
    // Акселерация
    sat.vx += force * (dx / distance) * 10;
    sat.vy += force * (dy / distance) * 10;

    // Спутниктин ордун жаңыртуу
    sat.x += sat.vx;
    sat.y += sat.vy;

    // 2. Сүрөттөрдү тартуу
    // Жер (Планета)
    ctx.beginPath();
    ctx.arc(earth.x, earth.y, earth.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#1e90ff';
    ctx.fill();
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#1e90ff';
    ctx.closePath();

    // Спутник
    ctx.beginPath();
    ctx.arc(sat.x, sat.y, sat.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.closePath();

    // Экрандагы маалыматты жаңыртуу
    document.getElementById('speed-val').innerText = Math.round(Math.abs(sat.vx) + Math.abs(sat.vy));

    requestAnimationFrame(gameLoop);
}
