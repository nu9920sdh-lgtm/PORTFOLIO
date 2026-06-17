document.addEventListener('DOMContentLoaded', function() {
    var panel = document.querySelector('.game-panel');
    var stage = document.querySelector('.game-stage');
    var character = document.querySelector('.game-character');
    var obstacle = document.querySelector('.game-obstacle');
    var flyingObstacle = document.querySelector('.game-flying-obstacle');
    var scoreEl = document.getElementById('game-score');
    var bestEl = document.getElementById('game-best');
    var stateEl = document.querySelector('.game-state');
    var startBtn = document.querySelector('.game-start-btn');
    var characterOptions = document.querySelectorAll('.game-character-option');

    if (!panel || !stage || !character || !obstacle || !flyingObstacle || !scoreEl || !bestEl || !stateEl || !startBtn) {
        return;
    }

    var characterX = 110;
    var groundBottom = 75;
    var characterSize = 96;
    var obstacleWidth = 86;
    var obstacleHeight = 86;
    var flyingObstacleWidth = 86;
    var flyingObstacleHeight = 86;
    var flyingObstacleBottom = 172;
    var stageWidth = 1200;
    var obstacleX = stageWidth + 80;
    var activeObstacleType = 'ground';
    var velocityY = 0;
    var characterY = 0;
    var score = 0;
    var scoreValue = 0;
    var best = 0;
    var speed = 420;
    var lastTime = 0;
    var animationId = null;
    var isRunning = false;
    var isGameOver = false;
    var isSectionVisible = true;

    function syncStageWidth() {
        stageWidth = stage.clientWidth || 1200;
    }

    function setCharacterPosition() {
        character.style.bottom = groundBottom + characterY + 'px';
    }

    function setObstaclePosition() {
        obstacle.style.transform = 'translateX(' + obstacleX + 'px)';
        flyingObstacle.style.transform = 'translateX(' + obstacleX + 'px)';
        obstacle.style.visibility = activeObstacleType === 'ground' ? 'visible' : 'hidden';
        flyingObstacle.style.visibility = activeObstacleType === 'flying' ? 'visible' : 'hidden';
    }

    function chooseNextObstacle() {
        activeObstacleType = Math.random() < 0.34 ? 'flying' : 'ground';
    }

    function setScore(value) {
        scoreValue = Math.max(0, value);
        score = Math.floor(scoreValue);
        scoreEl.textContent = score;
    }

    function resetGame() {
        syncStageWidth();
        obstacleX = stageWidth + 80;
        activeObstacleType = 'ground';
        velocityY = 0;
        characterY = 0;
        speed = 420;
        setScore(0);
        setCharacterPosition();
        setObstaclePosition();
    }

    function startGame() {
        if (!isSectionVisible || document.hidden) {
            return;
        }

        cancelAnimationFrame(animationId);
        resetGame();
        isRunning = true;
        isGameOver = false;
        lastTime = 0;
        panel.classList.add('is-running');
        stateEl.textContent = '';
        startBtn.textContent = 'RESTART';
        stage.focus();
        animationId = requestAnimationFrame(loop);
    }

    function endGame() {
        isRunning = false;
        isGameOver = true;
        panel.classList.remove('is-running');
        stateEl.textContent = 'GAME OVER';
        best = Math.max(best, score);
        bestEl.textContent = best;
        cancelAnimationFrame(animationId);
    }

    function stopGame(message) {
        cancelAnimationFrame(animationId);
        isRunning = false;
        isGameOver = false;
        panel.classList.remove('is-running');
        stateEl.textContent = message || 'START';
        startBtn.textContent = 'START';
        resetGame();
    }

    function selectCharacter(option) {
        if (!option || !option.dataset.character) {
            return;
        }

        character.src = option.dataset.character;
        characterOptions.forEach(function(item) {
            item.classList.toggle('active', item === option);
        });

        if (isRunning || isGameOver) {
            cancelAnimationFrame(animationId);
            isRunning = false;
            isGameOver = false;
            panel.classList.remove('is-running');
            stateEl.textContent = 'START';
            startBtn.textContent = 'START';
            resetGame();
        }
    }

    function jump() {
        if (!isSectionVisible || document.hidden) {
            return;
        }

        if (!isRunning) {
            startGame();
            return;
        }

        if (characterY <= 0.5) {
            velocityY = 760;
        }
    }

    function update(delta) {
        var gravity = 2050;

        velocityY -= gravity * delta;
        characterY += velocityY * delta;

        if (characterY <= 0) {
            characterY = 0;
            velocityY = 0;
        }

        obstacleX -= speed * delta;
        if (obstacleX < -90) {
            obstacleX = stageWidth + 120 + Math.random() * 280;
            chooseNextObstacle();
            speed = Math.min(speed + 18, 760);
        }

        setScore(scoreValue + delta * 10);
        setCharacterPosition();
        setObstaclePosition();
    }

    function isColliding() {
        var characterLeft = characterX + 12;
        var characterRight = characterX + characterSize - 10;
        var characterBottom = groundBottom + characterY + 6;
        var characterTop = groundBottom + characterY + characterSize - 8;

        var currentObstacleWidth = activeObstacleType === 'flying' ? flyingObstacleWidth : obstacleWidth;
        var currentObstacleHeight = activeObstacleType === 'flying' ? flyingObstacleHeight : obstacleHeight;
        var currentObstacleBottom = activeObstacleType === 'flying' ? flyingObstacleBottom : groundBottom;
        var horizontalPadding = activeObstacleType === 'flying' ? 4 : 10;
        var verticalPadding = activeObstacleType === 'flying' ? 8 : 6;
        var obstacleLeft = obstacleX + horizontalPadding;
        var obstacleRight = obstacleX + currentObstacleWidth - horizontalPadding;
        var obstacleBottom = currentObstacleBottom + verticalPadding;
        var obstacleTop = currentObstacleBottom + currentObstacleHeight - verticalPadding;

        return (
            characterRight > obstacleLeft &&
            characterLeft < obstacleRight &&
            characterTop > obstacleBottom &&
            characterBottom < obstacleTop
        );
    }

    function loop(time) {
        if (!isRunning || !isSectionVisible || document.hidden) {
            return;
        }

        if (!lastTime) {
            lastTime = time;
        }

        var delta = Math.min((time - lastTime) / 1000, 0.032);
        lastTime = time;

        update(delta);

        if (isColliding()) {
            endGame();
            return;
        }

        animationId = requestAnimationFrame(loop);
    }

    function isTypingTarget(target) {
        return target && (
            target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.tagName === 'SELECT' ||
            target.isContentEditable
        );
    }

    startBtn.addEventListener('click', startGame);
    stage.addEventListener('click', jump);
    stage.addEventListener('touchstart', function(event) {
        event.preventDefault();
        jump();
    }, { passive: false });

    document.addEventListener('keydown', function(event) {
        if (isTypingTarget(event.target)) {
            return;
        }

        if (event.code === 'Space' || event.code === 'ArrowUp') {
            event.preventDefault();
            jump();
        }

        if (isGameOver && event.code === 'Enter') {
            event.preventDefault();
            startGame();
        }
    });

    characterOptions.forEach(function(option) {
        option.addEventListener('click', function() {
            selectCharacter(option);
        });
    });

    window.addEventListener('resize', function() {
        syncStageWidth();
        if (!isRunning) {
            obstacleX = stageWidth + 80;
            setObstaclePosition();
        }
    });

    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function(entries) {
            isSectionVisible = entries[0].isIntersecting;
            if (!isSectionVisible && isRunning) {
                stopGame('START');
            }
        }, { threshold: 0.12 });

        observer.observe(panel);
    }

    document.addEventListener('visibilitychange', function() {
        if (document.hidden && isRunning) {
            stopGame('START');
        }
    });

    resetGame();
});
