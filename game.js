const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

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
    if(level === 1) initLevel1();
}

// --- LEVEL 1: ORBITAL MECHANICS ---
let earth = { x: canvas.width / 2, y: canvas.height / 2, radius: 60 };
let sat = { x: canvas.width / 2, y: canvas.height / 2 - 120, radius: 8, vx: 0, vy: 0, launched: false };
const G = 0.4; 
let gameOver = false;
let message = "Press SPACE to launch the satellite!";
let angleCount = 0; // Orbits tracker
let lastAngle = 0;

window.addEventListener('keydown', (e) => {
    if(e.code === 'Space' && !sat.launched) {
        sat.vx = 4.8; // Perfect speed for stable orbit
        sat.launched = true;
        message = "Maintain a stable orbit!";
    }
});

function initLevel1() {
    gameLoop();
}

function gameLoop() {
    if(gameOver) return;

    ctx.fillStyle = '#020205';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if(sat.launched) {
        let dx = earth.x - sat.x;
        let dy = earth.y - sat.y;
        let distance = Math.sqrt(dx*dx + dy*dy);
        
        // Physics logic
        let force = (G * earth.radius) / (distance * distance);
        sat.vx += force * (dx / distance) * 15;
        sat.vy += force * (dy / distance) * 15;

        sat.x += sat.vx;
        sat.y += sat.vy;

        // Orbit counter logic
        let currentAngle = Math.atan2(dy, dx);
        if (lastAngle < 0 && currentAngle >= 0) angleCount++;
        lastAngle = currentAngle;

        // Lose conditions
        if(distance < earth.radius + sat.radius) {
            message = "CRASHED! Too close to Earth.";
            gameOver = true;
        }
        if(distance > 800) {
            message = "LOST! Drifted away from gravity.";
            gameOver = true;
        }

        // Win condition
        if(angleCount >= 3) {
            message = "MISSION SUCCESS! Stable orbit achieved.";
            ctx.fillStyle = "#00ff00";
            gameOver = true;
        }
    }

    // Drawing Earth
    ctx.shadowBlur = 30;
    ctx.shadowColor = '#00d4ff';
    ctx.beginPath();
    ctx.arc(earth.x, earth.y, earth.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#1e90ff';
    ctx.fill();
    ctx.closePath();

    // Drawing Satellite
    ctx.shadowBlur = 15;
    ctx.shadowColor = 'white';
    ctx.beginPath();
    ctx.arc(sat.x, sat.y, sat.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.closePath();

    // Text Feedback
    ctx.shadowBlur = 0;
    ctx.fillStyle = "white";
    ctx.font = "bold 22px Arial";
    ctx.textAlign = "center";
    ctx.fillText(message, canvas.width / 2, 60);
    
    if(sat.launched && !gameOver) {
        ctx.fillText(`Orbits: ${angleCount} / 3`, canvas.width / 2, 100);
    }

    document.getElementById('speed-val').innerText = Math.round(Math.sqrt(sat.vx**2 + sat.vy**2) * 10);

    requestAnimationFrame(gameLoop);
}
