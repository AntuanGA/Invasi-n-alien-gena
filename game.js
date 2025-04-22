const gameContainer = document.getElementById('game-container');
const player = document.getElementById('player');
const scoreDisplay = document.getElementById('score');

let score = 0;
let enemies = [];
let bullets = [];
let gameInterval;
let enemyInterval;

// Sonidos
const shootSound = new Audio('sounds/shoot.mp3');
const explosionSound = new Audio('sounds/explosion.mp3');
const gameOverSound = new Audio('sounds/gameover.mp3');

// Generar estrellas en la pantalla de inicio
function generateStars() {
    const starCount = 100; // Número de estrellas
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        star.style.left = `${Math.random() * 100}vw`;
        star.style.animationDuration = `${Math.random() * 2 + 1}s`; // Duración aleatoria
        star.style.animationDelay = `${Math.random() * 5}s`; // Retraso aleatorio
        document.getElementById('start-screen').appendChild(star);
    }
}

// Mostrar la pantalla de inicio al cargar
function showStartScreen() {
    const startScreen = document.createElement('div');
    startScreen.id = 'start-screen';
    startScreen.innerHTML = `
        <h1>Invasión Espacial</h1>
        <button id="start-button">Comenzar</button>
    `;
    gameContainer.appendChild(startScreen);

    generateStars(); // Generar estrellas

    document.getElementById('start-button').addEventListener('click', () => {
        startScreen.remove();
        startGame();
    });
}

// Iniciar el juego
function startGame() {
    score = 0;
    scoreDisplay.textContent = `Score: ${score}`;
    gameInterval = setInterval(updateGame, 50);
    enemyInterval = setInterval(createEnemy, 1000);
}

// Terminar el juego
function endGame() {
    clearInterval(gameInterval);
    clearInterval(enemyInterval);
    gameOverSound.play();
    alert('Game Over! Your score: ' + score);
    window.location.reload();
}

// Mover la nave del jugador
document.addEventListener('keydown', (e) => {
    const playerRect = player.getBoundingClientRect();
    if (e.key === 'ArrowLeft' && playerRect.left > 0) {
        player.style.left = `${player.offsetLeft - 20}px`;
    } else if (e.key === 'ArrowRight' && playerRect.right < window.innerWidth) {
        player.style.left = `${player.offsetLeft + 20}px`;
    } else if (e.key === ' ') {
        shootBullet();
    }
});

function shootBullet() {
    const bullet = document.createElement('div');
    bullet.classList.add('bullet');

    // Obtén la posición absoluta del jugador
    const playerRect = player.getBoundingClientRect();

    // Calcula la posición horizontal de la bala (centro del jugador)
    bullet.style.left = `${playerRect.left + playerRect.width / 2 - 2.5}px`;

    // Establece la posición inicial de la bala (justo encima del jugador)
    bullet.style.bottom = `${window.innerHeight - playerRect.bottom + 20}px`;

    gameContainer.appendChild(bullet);
    bullets.push(bullet);
    shootSound.play();
}

// Crear enemigos
function createEnemy() {
    const enemy = document.createElement('div');
    enemy.classList.add('enemy');
    enemy.style.left = `${Math.random() * (window.innerWidth - 40)}px`;
    enemy.style.top = '0px';
    gameContainer.appendChild(enemy);
    enemies.push(enemy);
}

// Actualizar el juego
function updateGame() {
    // Mover balas
    bullets.forEach((bullet, index) => {
        // Mueve la bala hacia arriba
        bullet.style.bottom = `${parseInt(bullet.style.bottom) + 10}px`;

        // Elimina la bala si sale de la pantalla
        if (parseInt(bullet.style.bottom) > window.innerHeight) {
            bullet.remove();
            bullets.splice(index, 1);
        }
    });

    // Mover enemigos
    enemies.forEach((enemy, index) => {
        enemy.style.top = `${enemy.offsetTop + 5}px`;

        // Detectar colisión con el jugador
        const enemyRect = enemy.getBoundingClientRect();
        const playerRect = player.getBoundingClientRect();
        if (
            enemyRect.bottom > playerRect.top &&
            enemyRect.top < playerRect.bottom &&
            enemyRect.left < playerRect.right &&
            enemyRect.right > playerRect.left
        ) {
            endGame();
        }

        // Detectar colisión con balas
        bullets.forEach((bullet, bulletIndex) => {
            const bulletRect = bullet.getBoundingClientRect();
            if (
                bulletRect.bottom > enemyRect.top &&
                bulletRect.top < enemyRect.bottom &&
                bulletRect.left < enemyRect.right &&
                bulletRect.right > enemyRect.left
            ) {
                enemy.remove();
                bullet.remove();
                enemies.splice(index, 1);
                bullets.splice(bulletIndex, 1);
                score += 10;
                scoreDisplay.textContent = `Score: ${score}`;
                explosionSound.play();

                // Incrementar dificultad
                if (score % 50 === 0) {
                    clearInterval(enemyInterval);
                    enemyInterval = setInterval(createEnemy, Math.max(500, 1000 - score));
                }
            }
        });

        // Eliminar enemigos que salen de la pantalla
        if (enemy.offsetTop > window.innerHeight) {
            enemy.remove();
            enemies.splice(index, 1);
        }
    });
}

// Mostrar la pantalla de inicio al cargar
showStartScreen();