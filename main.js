/**
 * PUZZLE QUEST: TRIPULACIÓN ECLÉCTICA
 * Lógica del Juego (main.js)
 * Algoritmo: Deslizamiento garantizado 100% solucionable, renderizado dinámico por CSS,
 * Web Audio API (efectos de sonido), confeti procedural en Canvas y control de 4 niveles.
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. CONFIGURACIÓN DE LOS NIVELES
       ========================================================================== */
    const LEVELS = [
        {
            id: 0,
            name: "Marita",
            title: "La Observadora de la Noche",
            img: "img/marita.jpeg",
            accent: "#10b981",
            glow: "rgba(16, 185, 129, 0.4)",
            emoji: "🐱"
        },
        {
            id: 1,
            name: "Megan",
            title: "La Guardiana del Pan",
            img: "img/megan.jpeg",
            accent: "#3b82f6",
            glow: "rgba(59, 130, 246, 0.4)",
            emoji: "🐕"
        },
        {
            id: 2,
            name: "Huevancas",
            title: "El Acróbata del Equipo",
            img: "img/kevin.jpeg",
            accent: "#f59e0b",
            glow: "rgba(245, 158, 11, 0.4)",
            emoji: "⚡"
        },
        {
            id: 3,
            name: "Exequiel Palac",
            title: "La Oveja Rosa Fabulosa",
            img: "img/exequiel.jpeg",
            accent: "#ec4899",
            glow: "rgba(236, 72, 153, 0.4)",
            emoji: "🐑"
        }
    ];

    // Estado global del juego
    let currentLevelIdx = 0;
    let gridSize = 3; // 3x3 por defecto
    let tiles = []; // Array unidimensional que representa el tablero
    let emptyIndex = 0; // Índice de la casilla vacía
    let moves = 0;
    let timerInterval = null;
    let secondsElapsed = 0;
    let isPlaying = false;
    let isMuted = false;
    let isPeeking = false;

    // Elementos del DOM
    const puzzleBoard = document.getElementById('puzzleBoard');
    const boardFrame = document.getElementById('boardFrame');
    const timerDisplay = document.getElementById('timerDisplay');
    const movesDisplay = document.getElementById('movesDisplay');
    const levelTabs = document.querySelectorAll('.level-tab');
    const gridBtns = document.querySelectorAll('.grid-btn');
    const previewOverlay = document.getElementById('previewOverlay');
    const previewImg = document.getElementById('previewImg');

    // Botones de acción
    const shuffleBtn = document.getElementById('shuffleBtn');
    const peekBtn = document.getElementById('peekBtn');
    const resetBtn = document.getElementById('resetBtn');
    const soundToggleBtn = document.getElementById('soundToggleBtn');
    const soundIcon = document.getElementById('soundIcon');
    const helpBtn = document.getElementById('helpBtn');
    const closeHelpBtn = document.getElementById('closeHelpBtn');
    const startPlayingBtn = document.getElementById('startPlayingBtn');
    const helpModal = document.getElementById('helpModal');

    // Modales de Victoria
    const winModal = document.getElementById('winModal');
    const winMessage = document.getElementById('winMessage');
    const winLevelImg = document.getElementById('winLevelImg');
    const winTime = document.getElementById('winTime');
    const winMoves = document.getElementById('winMoves');
    const nextLevelBtn = document.getElementById('nextLevelBtn');
    const replayBtn = document.getElementById('replayBtn');

    /* ==========================================================================
       2. MOTOR DE SONIDO (WEB AUDIO API)
       ========================================================================== */
    let audioCtx = null;

    function playSound(type) {
        if (isMuted) return;
        try {
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }

            const now = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            if (type === 'slide') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(380, now);
                osc.frequency.exponentialRampToValueAtTime(540, now + 0.06);
                gain.gain.setValueAtTime(0.08, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
                osc.start(now);
                osc.stop(now + 0.06);
            } else if (type === 'click') {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(450, now);
                gain.gain.setValueAtTime(0.05, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
                osc.start(now);
                osc.stop(now + 0.05);
            } else if (type === 'shuffle') {
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(220, now);
                osc.frequency.exponentialRampToValueAtTime(660, now + 0.18);
                gain.gain.setValueAtTime(0.04, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
                osc.start(now);
                osc.stop(now + 0.18);
            } else if (type === 'win') {
                // Acorde triunfal
                [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
                    const o = audioCtx.createOscillator();
                    const g = audioCtx.createGain();
                    o.connect(g);
                    g.connect(audioCtx.destination);
                    o.type = 'triangle';
                    o.frequency.setValueAtTime(freq, now + i * 0.08);
                    g.gain.setValueAtTime(0.08, now + i * 0.08);
                    g.gain.exponentialRampToValueAtTime(0.001, now + 0.6 + i * 0.08);
                    o.start(now + i * 0.08);
                    o.stop(now + 0.6 + i * 0.08);
                });
            }
        } catch (e) {}
    }

    /* ==========================================================================
       3. GESTIÓN DEL TEMPORIZADOR Y MOVIMIENTOS
       ========================================================================== */
    function startTimer() {
        if (timerInterval) return;
        isPlaying = true;
        timerInterval = setInterval(() => {
            secondsElapsed++;
            const mins = String(Math.floor(secondsElapsed / 60)).padStart(2, '0');
            const secs = String(secondsElapsed % 60).padStart(2, '0');
            timerDisplay.textContent = `${mins}:${secs}`;
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
        timerInterval = null;
        isPlaying = false;
    }

    function resetStats() {
        stopTimer();
        secondsElapsed = 0;
        moves = 0;
        timerDisplay.textContent = "00:00";
        movesDisplay.textContent = "0";
    }

    /* ==========================================================================
       4. GENERADOR DE ROMPECABEZAS (100% SOLUCIONABLE)
       ========================================================================== */
    function initPuzzle(shuffle = true) {
        resetStats();
        const totalTiles = gridSize * gridSize;
        const currentLvl = LEVELS[currentLevelIdx];

        // Actualizar variables de color CSS
        document.documentElement.style.setProperty('--current-accent', currentLvl.accent);
        document.documentElement.style.setProperty('--current-glow', currentLvl.glow);

        // Actualizar imagen en preview
        previewImg.src = currentLvl.img;

        // Configurar grid CSS
        puzzleBoard.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
        puzzleBoard.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

        // Estado resuelto: [0, 1, 2, ..., totalTiles - 1]
        // La última pieza (totalTiles - 1) es el espacio vacío
        tiles = Array.from({ length: totalTiles }, (_, i) => i);
        emptyIndex = totalTiles - 1;

        if (shuffle) {
            // Algoritmo de mezcla por movimientos válidos sucesivos (garantiza 100% de resolubilidad)
            const shuffleMoves = gridSize === 3 ? 120 : 220;
            let lastMoved = -1;

            for (let i = 0; i < shuffleMoves; i++) {
                const validNeighbors = getAdjacentIndices(emptyIndex).filter(idx => idx !== lastMoved);
                const randomNeighbor = validNeighbors[Math.floor(Math.random() * validNeighbors.length)];
                
                // Intercambiar
                tiles[emptyIndex] = tiles[randomNeighbor];
                tiles[randomNeighbor] = totalTiles - 1;
                lastMoved = emptyIndex;
                emptyIndex = randomNeighbor;
            }
        }

        renderBoard();
    }

    // Obtener casillas vecinas válidas (Arriba, Abajo, Izquierda, Derecha)
    function getAdjacentIndices(index) {
        const neighbors = [];
        const row = Math.floor(index / gridSize);
        const col = index % gridSize;

        if (row > 0) neighbors.push(index - gridSize); // Arriba
        if (row < gridSize - 1) neighbors.push(index + gridSize); // Abajo
        if (col > 0) neighbors.push(index - 1); // Izquierda
        if (col < gridSize - 1) neighbors.push(index + 1); // Derecha

        return neighbors;
    }

    /* ==========================================================================
       5. RENDERIZADO DEL TABLERO
       ========================================================================== */
    function renderBoard() {
        puzzleBoard.innerHTML = '';
        const totalTiles = gridSize * gridSize;
        const currentLvl = LEVELS[currentLevelIdx];
        const tileSizePercent = 100 / (gridSize - 1);

        tiles.forEach((tileValue, currentIndex) => {
            const tile = document.createElement('div');
            tile.classList.add('puzzle-tile');
            tile.dataset.index = currentIndex;

            if (tileValue === totalTiles - 1) {
                // Espacio Vacío
                tile.classList.add('empty');
            } else {
                // Ficha con porción de imagen
                const originalRow = Math.floor(tileValue / gridSize);
                const originalCol = tileValue % gridSize;
                const posX = originalCol * tileSizePercent;
                const posY = originalRow * tileSizePercent;

                tile.style.backgroundImage = `url(${currentLvl.img})`;
                tile.style.backgroundSize = `${gridSize * 100}% ${gridSize * 100}%`;
                tile.style.backgroundPosition = `${posX}% ${posY}%`;

                // Evento de clic / toque para deslizar
                tile.addEventListener('click', () => handleTileClick(currentIndex));
            }

            puzzleBoard.appendChild(tile);
        });
    }

    /* ==========================================================================
       6. INTERACCIÓN Y DESPLAZAMIENTO DE FICHAS
       ========================================================================== */
    function handleTileClick(clickedIndex) {
        const adjacent = getAdjacentIndices(emptyIndex);

        if (adjacent.includes(clickedIndex)) {
            if (!isPlaying) startTimer();

            // Mover ficha hacia el espacio vacío
            tiles[emptyIndex] = tiles[clickedIndex];
            tiles[clickedIndex] = (gridSize * gridSize) - 1;
            emptyIndex = clickedIndex;

            moves++;
            movesDisplay.textContent = moves;
            playSound('slide');

            renderBoard();

            // Verificar si ganó
            checkVictory();
        }
    }

    /* ==========================================================================
       7. VERIFICACIÓN DE VICTORIA
       ========================================================================== */
    function checkVictory() {
        const totalTiles = gridSize * gridSize;
        const isSolved = tiles.every((val, index) => val === index);

        if (isSolved) {
            stopTimer();
            playSound('win');
            triggerConfetti();

            const currentLvl = LEVELS[currentLevelIdx];
            winMessage.textContent = `¡Has completado el rompecabezas de ${currentLvl.name} (${currentLvl.title})!`;
            winLevelImg.src = currentLvl.img;
            winTime.textContent = timerDisplay.textContent;
            winMoves.textContent = moves;

            setTimeout(() => {
                winModal.classList.add('active');
                winModal.setAttribute('aria-hidden', 'false');
            }, 300);
        }
    }

    /* ==========================================================================
       8. MOTOR DE CONFETI PROCEDURAL (CANVAS)
       ========================================================================== */
    const confettiCanvas = document.getElementById('confettiCanvas');
    const ctx = confettiCanvas.getContext('2d');
    let confettiParticles = [];
    let confettiAnimId = null;

    function resizeCanvas() {
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class ConfettiParticle {
        constructor() {
            this.x = Math.random() * confettiCanvas.width;
            this.y = Math.random() * -confettiCanvas.height;
            this.size = Math.random() * 8 + 4;
            this.speedY = Math.random() * 4 + 2;
            this.speedX = (Math.random() - 0.5) * 3;
            this.rotation = Math.random() * 360;
            this.rotSpeed = (Math.random() - 0.5) * 8;
            this.color = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#38bdf8', '#fbbf24'][Math.floor(Math.random() * 6)];
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            this.rotation += this.rotSpeed;
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((this.rotation * Math.PI) / 180);
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
            ctx.restore();
        }
    }

    function triggerConfetti() {
        cancelAnimationFrame(confettiAnimId);
        confettiParticles = Array.from({ length: 120 }, () => new ConfettiParticle());
        
        let frames = 0;
        function renderConfetti() {
            ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
            confettiParticles.forEach(p => {
                p.update();
                p.draw();
            });

            frames++;
            if (frames < 200) {
                confettiAnimId = requestAnimationFrame(renderConfetti);
            } else {
                ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
            }
        }
        renderConfetti();
    }

    /* ==========================================================================
       9. CONTROLES Y EVENT LISTENERS
       ========================================================================== */
    // Cambio de Nivel (Tabs de Personajes)
    levelTabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            levelTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentLevelIdx = index;
            playSound('click');
            initPuzzle(true);
        });
    });

    // Selector de Dificultad (3x3 o 4x4)
    gridBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            gridBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            gridSize = parseInt(btn.getAttribute('data-grid'));
            playSound('click');
            initPuzzle(true);
        });
    });

    // Botón Mezclar
    shuffleBtn.addEventListener('click', () => {
        playSound('shuffle');
        initPuzzle(true);
    });

    // Botón Ver Original / Pista (Peek)
    peekBtn.addEventListener('click', () => {
        isPeeking = !isPeeking;
        playSound('click');
        if (isPeeking) {
            previewOverlay.classList.add('active');
            peekBtn.classList.add('btn-shuffle');
        } else {
            previewOverlay.classList.remove('active');
            peekBtn.classList.remove('btn-shuffle');
        }
    });

    // Ocultar preview si hace clic en la imagen
    previewOverlay.addEventListener('click', () => {
        isPeeking = false;
        previewOverlay.classList.remove('active');
        peekBtn.classList.remove('btn-shuffle');
    });

    // Botón Reiniciar
    resetBtn.addEventListener('click', () => {
        playSound('click');
        initPuzzle(true);
    });

    // Botón Sonido
    soundToggleBtn.addEventListener('click', () => {
        isMuted = !isMuted;
        if (isMuted) {
            soundIcon.className = 'fa-solid fa-volume-xmark';
        } else {
            soundIcon.className = 'fa-solid fa-volume-high';
            playSound('click');
        }
    });

    // Modales
    helpBtn.addEventListener('click', () => {
        playSound('click');
        helpModal.classList.add('active');
    });
    closeHelpBtn.addEventListener('click', () => helpModal.classList.remove('active'));
    startPlayingBtn.addEventListener('click', () => helpModal.classList.remove('active'));

    // Siguiente Nivel en Modal Victoria
    nextLevelBtn.addEventListener('click', () => {
        winModal.classList.remove('active');
        currentLevelIdx = (currentLevelIdx + 1) % LEVELS.length;
        levelTabs.forEach(t => t.classList.remove('active'));
        levelTabs[currentLevelIdx].classList.add('active');
        playSound('click');
        initPuzzle(true);
    });

    // Replay en Modal Victoria
    replayBtn.addEventListener('click', () => {
        winModal.classList.remove('active');
        playSound('shuffle');
        initPuzzle(true);
    });

    /* Iniciar primer nivel */
    initPuzzle(true);

});
