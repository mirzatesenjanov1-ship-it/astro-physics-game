const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let currentLevel = 0;
let gameOver = false;
let message = "";

// --- LEVEL 1 DATA (Orbit) ---
let earth = { x: canvas.width / 2, y: canvas.height / 2, radius: 60 };
let sat = { x: canvas.width / 2, y: canvas.height / 2 - 120, radius: 8, vx: 0, vy: 0, launched: false };
const G = 0.4;
let angleCount = 0;
let lastAngle = 0;

// --- LEVEL 2 DATA (Star) ---
let pressure = 50;
let targetPressure = 50;
let starRadius = 50;

// --- LEVEL 3 DATA (Black Hole) ---
let blackHole = { x: canvas.width / 2, y: canvas.height / 2, radius: 45 };
let ship = { x: 150, y: 150, vx: 1.5, vy: 0, radius: 10 };
let timeFactor = 1;

function showLevels() {
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('level-menu').style.display = 'flex';
}

function startLevel(level) {
    currentLevel = level;
    gameOver = false;
    document.getElementById('level-menu').style.display = 'none';
    document.getElementById('game-ui').style.display = 'block';
    
    // Reset data for the levels
    if (level === 1) {
        sat = { x: canvas.width / 2, y: canvas.height / 2 - 120, radius: 8, vx: 0, vy: 0, launched: false };
        angleCount = 0;
        message = "Press SPACE to launch the satellite!";
        requestAnimationFrame(gameLoopLevel1);
    } else if (level === 2) {
        pressure = 50; targetPressure = 50;
        message = "Balance the Star! Use UP/DOWN arrows";
        requestAnimationFrame(gameLoopLevel2);
    } else if (level === 3) {
        ship = { x: 150, y: 150, vx: 2, vy: 0, radius: 10 };
        message = "Avoid the Event Horizon! Use ARROW KEYS to move";
        requestAnimationFrame(gameLoopLevel3);
    }
}

// БАШКАРУУ ЛОГИКАСЫ (ОҢДОЛДУ)
window.addEventListener('keydown', (e) => {
    if (gameOver) return;

    if (currentLevel === 1 && e.code === 'Space' && !sat.launched) {
        sat.vx = 4.8;
        sat.launched = true;
        message = "Maintain a stable orbit!";
    }
    if (currentLevel === 2) {
        if (e.code === 'ArrowUp') targetPressure += 8;
        if (e.code === 'ArrowDown') targetPressure -= 8;
    }
    if (currentLevel === 3) {
        if (e.code === 'ArrowUp') ship.vy -= 0.5;
        if (e.code === 'ArrowDown') ship.vy += 0.5;
        if (e.code === 'ArrowLeft') ship.vx -= 0.5;
        if (e.code === 'ArrowRight') ship.vx += 0.5;
    }
});

// --- LEVEL 1 LOOP ---
function gameLoopLevel1() {
    if (currentLevel !== 1 || gameOver) return;
    ctx.fillStyle = '#020205';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (sat.launched) {
        let dx = earth.x - sat.x;
        let dy = earth.y - sat.y;
        let dist = Math.sqrt(dx*dx + dy*dy);
        let force = (G * earth.radius) / (dist * dist);
        sat.vx += force * (dx / dist) * 15;
        sat.vy += force * (dy / dist) * 15;
        sat.x += sat.vx; sat.y += sat.vy;

        let currentAngle = Math.atan2(dy, dx);
        if (lastAngle < 0 && currentAngle >= 0) angleCount++;
        lastAngle = currentAngle;

        if (dist < earth.radius + sat.radius) { message = "CRASHED!"; gameOver = true; }
        if (dist > 800) { message = "LOST IN SPACE!"; gameOver = true; }
        if (angleCount >= 3) { message = "SUCCESS! Stable orbit achieved."; gameOver = true; }
    }

    drawObject(earth.x, earth.y, earth.radius, '#1e90ff', 30);
    drawObject(sat.x, sat.y, sat.radius, 'white', 15);
    drawUI();
    requestAnimationFrame(gameLoopLevel1);
}

// --- LEVEL 2 LOOP ---
function gameLoopLevel2() {
    if (currentLevel !== 2 || gameOver) return;
    ctx.fillStyle = '#020205';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    pressure += (targetPressure - pressure) * 0.05;
    starRadius = 150 - (pressure * 1.2);

    let r = Math.min(255, pressure * 5);
    let g = Math.min(255, 255 - Math.abs(pressure - 50) * 4);
    let b = Math.min(255, 255 - pressure * 2);
    let starColor = `rgb(${r}, ${g}, ${b})`;

    drawObject(canvas.width / 2, canvas.height / 2, starRadius, starColor, 50);

    if (pressure > 95) { message = "SUPERNOVA EXPLOSION!"; gameOver = true; }
    if (pressure < 10) { message = "COLLAPSED INTO A DWARF!"; gameOver = true; }

    drawUI(`Internal Pressure: ${Math.round(pressure)}%`);
    requestAnimationFrame(gameLoopLevel2);
}

// --- LEVEL 3 LOOP (ЖАҢЫ КОШУЛДУ) ---
function gameLoopLevel3() {
    if (currentLevel !== 3 || gameOver) return;
    ctx.fillStyle = '#020205';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let dx = blackHole.x - ship.x;
    let dy = blackHole.y - ship.y;
    let dist = Math.sqrt(dx*dx + dy*dy);

    // Салыштырмалуулук теориясы: Убакыттын жайлашы
    timeFactor = Math.max(0.1, (dist - blackHole.radius) / 250);
    
    // Гравитация
    let force = (G * 800) / (dist * dist);
    ship.vx += force * (dx / dist);
    ship.vy += force * (dy / dist);

    ship.x += ship.vx * timeFactor;
    ship.y += ship.vy * timeFactor;

    // Сүрөттөө
    // Аккрециялык диск
    ctx.beginPath();
    ctx.arc(blackHole.x, blackHole.y, blackHole.radius + 50, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255, 140, 0, 0.2)";
    ctx.lineWidth = 15;
    ctx.stroke();

    drawObject(blackHole.x, blackHole.y, blackHole.radius, 'black', 40); // Кара туюк
    drawObject(ship.x, ship.y, ship.radius, '#00ff00', 15); // Кеме

    if (dist < blackHole.radius + 5) {
        message = "SPAGHETTIFIED! You fell in.";
        gameOver = true;
    }

    drawUI(`Time Dilation: x${timeFactor.toFixed(2)}`);
    requestAnimationFrame(gameLoopLevel3);
}

// ЖАРДАМЧЫ ФУНКЦИЯЛАР
function drawObject(x, y, r, color, blur) {
    ctx.shadowBlur = blur; ctx.shadowColor = color;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = color; ctx.fill(); ctx.closePath();
}

function drawUI(extra = "") {
    ctx.shadowBlur = 0; ctx.fillStyle = "white"; ctx.textAlign = "center";
    ctx.font = "bold 24px Arial"; ctx.fillText(message, canvas.width / 2, 60);
    ctx.font = "18px Arial"; ctx.fillText(extra, canvas.width / 2, 100);
    
    let speed = 0;
    if (currentLevel === 1) speed = Math.sqrt(sat.vx**2 + sat.vy**2);
    if (currentLevel === 3) speed = Math.sqrt(ship.vx**2 + ship.vy**2);
    
    document.getElementById('speed-val').innerText = Math.round(speed * 10);
}
