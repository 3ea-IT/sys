import React, { useEffect, useState } from "react";
import { Link } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";
import axios from "axios";

const Tetris = () => {
    const [gameOver, setGameOver] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [score, setScore] = useState(0);
    const [level, setLevel] = useState(1);
    const [linesCleared, setLinesCleared] = useState(0);
    const [nextPiece, setNextPiece] = useState(null);
    const [userId, setUserId] = useState(null);
    const [showInstructions, setShowInstructions] = useState(false);
    const [time, setTime] = useState(window.seconds || 0);

    useEffect(() => {
        const currentUserId = localStorage.getItem("userId") || "anonymous";
        setUserId(currentUserId);

        // Add styles with mobile-optimized layout
        const styleElement = document.createElement("style");
        styleElement.textContent = `
            html, body {
                height: 100%;
                margin: 0;
                font-family: 'Press Start 2P', monospace;
                touch-action: manipulation;
                background: #111;
            }
            
            body {
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                overflow: hidden;
                color: white;
            }
            
            canvas {
                border: 3px solid #039;
                background: rgba(0, 0, 0, 0.8);
                border-radius: 4px;
                box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5);
                margin: 10px 0;
                max-width: 100%;
            }
            
            .grid-cell {
                position: absolute;
                border-radius: 3px;
                box-shadow: inset 0 0 8px rgba(255, 255, 255, 0.1);
            }
            
            #control {
                display: flex;
                justify-content: center;
                align-items: center;
                margin-bottom: 10px;
            }
            
            .control-inner {
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            
            #game-control {
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 90%;
                max-width: 380px;
                background: rgba(51, 51, 51, 0.95);
                padding: 12px 15px;
                border-radius: 15px;
                box-shadow: 0 5px 20px rgba(0, 0, 0, 0.5);
                z-index: 100;
            }
            
            #game-control button {
                background: white;
                border: 2px solid #444;
                border-radius: 12px;
                cursor: pointer;
                width: 48px;
                height: 48px;
                margin: 0 3px;
                display: flex;
                justify-content: center;
                align-items: center;
                transition: all 0.2s;
                touch-action: manipulation;
            }
            
            #game-control button:active {
                background: #039;
                transform: scale(0.95);
            }
            
            #score-container {
                position: fixed;
                top: 70px;
                right: 10px;
                background: rgba(0, 0, 0, 0.85);
                padding: 8px 12px;
                border-radius: 8px;
                border: 2px solid #039;
                z-index: 50;
            }
            
            .score-item {
                margin-bottom: 6px;
            }
            
            .score-label {
                font-size: 10px;
                color: #aaa;
            }
            
            .score-value {
                font-size: 14px;
                color: #fff;
            }
            
            .time-container {
                position: fixed;
                top: 110px;
                left: 28px;
                background: rgba(0, 0, 0, 0.85);
                padding: 8px 12px;
                border-radius: 8px;
                border: 2px solid #039;
                z-index: 50;
            }

            @media (max-width: 640px) {
                canvas {
                    width: 280px !important;
                    height: auto !important;
                }
                
                #game-control {
                    bottom: 10px;
                    padding: 10px 12px;
                }
                
                #game-control button {
                    width: 44px;
                    height: 44px;
                    margin: 0 2px;
                }
                
                .score-label {
                    font-size: 8px;
                }
                
                .score-value {
                    font-size: 12px;
                }
            }
        `;
        document.head.appendChild(styleElement);

        // Add Google font
        const fontLink = document.createElement("link");
        fontLink.href =
            "https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap";
        fontLink.rel = "stylesheet";
        document.head.appendChild(fontLink);

        document.title = "Tetris Arcade";

        // Initialize global variables
        window.gameOver = false;
        window.tetrominoSequence = [];
        window.tetromino = null;
        window.rAF = null;
        window.seconds = 0;
        window.score = 0;
        window.level = 1;
        window.linesCleared = 0;

        // Make functions globally available
        window.startGame = startGame;
        window.moveTetris = moveTetris;
        window.rotateTetris = rotateTetris;
        window.fastTetris = fastTetris;
        window.restartGame = restartGame;

        // Cleanup on unmount
        return () => {
            if (window.rAF) {
                cancelAnimationFrame(window.rAF);
            }
            if (window.timerInterval) {
                clearInterval(window.timerInterval);
            }
            document.head.removeChild(styleElement);
            document.head.removeChild(fontLink);
        };
    }, []);

    // Function to restart the game
    const restartGame = () => {
        if (window.rAF) {
            cancelAnimationFrame(window.rAF);
        }
        if (window.timerInterval) {
            clearInterval(window.timerInterval);
        }
        startGame();
    };

    // Function to start the game
    const startGame = () => {
        window.seconds = 0;
        window.gameOver = false;
        window.score = 0;
        window.level = 1;
        window.linesCleared = 0;
        setGameOver(false);
        setGameStarted(true);
        setScore(0);
        setLevel(1);
        setLinesCleared(0);

        const canvas = document.getElementById("game");
        const context = canvas.getContext("2d");
        initializeGame(canvas, context);

        if (window.tetrominoSequence.length === 0) {
            generateSequence();
        }
        const nextPieceName =
            window.tetrominoSequence[window.tetrominoSequence.length - 1];
        setNextPiece(nextPieceName);

        window.tetromino = getNextTetromino();
        window.rAF = requestAnimationFrame(() => gameLoop(canvas, context));

        window.timerInterval = setInterval(() => {
            if (!window.gameOver) {
                window.seconds++;
                const timeDisplay = document.getElementById("time-value");
                if (timeDisplay) {
                    const minutes = Math.floor(window.seconds / 60);
                    const remainingSeconds = window.seconds % 60;
                    timeDisplay.textContent = `${minutes}:${remainingSeconds
                        .toString()
                        .padStart(2, "0")}`;
                }
            }
        }, 1000);
    };

    // Function to initialize the game
    const initializeGame = (canvas, context) => {
        const grid = 32;
        window.grid = grid;
        window.playfield = [];
        const X = 10;
        const Y = 19;
        window.X = X;
        window.Y = Y;

        for (let row = -2; row < Y; row++) {
            window.playfield[row] = [];
            for (let col = 0; col < X; col++) {
                window.playfield[row][col] = 0;
            }
        }

        window.tetrominos = {
            I: [
                [0, 0, 0, 0],
                [1, 1, 1, 1],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
            ],
            J: [
                [1, 0, 0],
                [1, 1, 1],
                [0, 0, 0],
            ],
            L: [
                [0, 0, 1],
                [1, 1, 1],
                [0, 0, 0],
            ],
            O: [
                [1, 1],
                [1, 1],
            ],
            S: [
                [0, 1, 1],
                [1, 1, 0],
                [0, 0, 0],
            ],
            Z: [
                [1, 1, 0],
                [0, 1, 1],
                [0, 0, 0],
            ],
            T: [
                [0, 1, 0],
                [1, 1, 1],
                [0, 0, 0],
            ],
        };

        window.colors = {
            I: "#00ffff",
            O: "#ffff00",
            T: "#aa00ff",
            S: "#00ff00",
            Z: "#ff0000",
            J: "#0000ff",
            L: "#ff7700",
        };

        window.colorGlow = {
            I: "0 0 5px #00ffff",
            O: "0 0 5px #ffff00",
            T: "0 0 5px #aa00ff",
            S: "0 0 5px #00ff00",
            Z: "0 0 5px #ff0000",
            J: "0 0 5px #0000ff",
            L: "0 0 5px #ff7700",
        };

        window.count = 0;
    };

    const generateSequence = () => {
        const sequence = ["I", "J", "L", "O", "S", "T", "Z"];
        while (sequence.length) {
            const rand = getRandomInt(0, sequence.length - 1);
            const name = sequence.splice(rand, 1)[0];
            window.tetrominoSequence.push(name);
        }
    };

    const getRandomInt = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const getNextTetromino = () => {
        if (window.tetrominoSequence.length === 0) {
            generateSequence();
        }
        const name = window.tetrominoSequence.pop();

        if (window.tetrominoSequence.length === 0) {
            generateSequence();
        }
        const nextPieceName =
            window.tetrominoSequence[window.tetrominoSequence.length - 1];
        setNextPiece(nextPieceName);

        const matrix = window.tetrominos[name];
        const col =
            window.playfield[0].length / 2 - Math.ceil(matrix[0].length / 2);
        const row = name === "I" ? -1 : -2;
        return {
            name: name,
            matrix: matrix,
            row: row,
            col: col,
        };
    };

    const rotate = (matrix) => {
        const N = matrix.length - 1;
        const result = matrix.map((row, i) =>
            row.map((val, j) => matrix[N - j][i]),
        );
        return result;
    };

    const isValidMove = (matrix, cellRow, cellCol) => {
        for (let row = 0; row < matrix.length; row++) {
            for (let col = 0; col < matrix[row].length; col++) {
                if (
                    matrix[row][col] &&
                    (cellCol + col < 0 ||
                        cellCol + col >= window.playfield[0].length ||
                        cellRow + row >= window.playfield.length ||
                        window.playfield[cellRow + row][cellCol + col])
                ) {
                    return false;
                }
            }
        }
        return true;
    };

    const placeTetromino = (canvas, context) => {
        for (let row = 0; row < window.tetromino.matrix.length; row++) {
            for (
                let col = 0;
                col < window.tetromino.matrix[row].length;
                col++
            ) {
                if (window.tetromino.matrix[row][col]) {
                    if (window.tetromino.row + row < 0) {
                        return showGameOver(canvas, context);
                    }
                    window.playfield[window.tetromino.row + row][
                        window.tetromino.col + col
                    ] = window.tetromino.name;
                }
            }
        }

        let linesCleared = 0;
        for (let row = window.playfield.length - 1; row >= 0; ) {
            if (window.playfield[row].every((cell) => !!cell)) {
                linesCleared++;
                for (let r = row; r >= 0; r--) {
                    for (let c = 0; c < window.playfield[r].length; c++) {
                        window.playfield[r][c] = window.playfield[r - 1][c];
                    }
                }
            } else {
                row--;
            }
        }

        if (linesCleared > 0) {
            const points = [0, 100, 300, 500, 800];
            const scoreToAdd = points[linesCleared] * window.level;
            window.score += scoreToAdd;
            setScore(window.score);
            window.linesCleared += linesCleared;
            setLinesCleared(window.linesCleared);

            const newLevel = Math.floor(window.linesCleared / 10) + 1;
            if (newLevel > window.level) {
                window.level = newLevel;
                setLevel(newLevel);
            }
        }

        window.tetromino = getNextTetromino();
    };

    const showGameOver = async (canvas, context) => {
        cancelAnimationFrame(window.rAF);
        window.gameOver = true;
        setGameOver(true);

        let finalScore = window.score;
        const bonusPoints = Math.floor(window.seconds / 300) * 10;
        finalScore += bonusPoints;

        const remarks =
            bonusPoints > 0
                ? `Played ${window.seconds} seconds: +${bonusPoints} bonus points!`
                : "Game Over";

        const pointsToAward = finalScore > 0 ? Math.max(1, Math.round(finalScore / 100)) : 0;
        if (pointsToAward > 0) {
            try {
                await axios.post(`/games/score`, {
                    points: pointsToAward,
                    remark: "Tetris",
                });
            } catch (error) {
                console.error("Error saving game score:", error);
            }
        }

        context.fillStyle = "rgba(0, 0, 0, 0.75)";
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.fillStyle = "#ff0066";
        context.font = "24px 'Press Start 2P'";
        context.textAlign = "center";
        context.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 48);

        context.fillStyle = "#ffffff";
        context.font = "16px 'Press Start 2P'";
        context.fillText(
            `Score: ${finalScore}`,
            canvas.width / 2,
            canvas.height / 2,
        );

        if (bonusPoints > 0) {
            context.fillStyle = "#00ff00";
            context.font = "12px 'Press Start 2P'";
            context.fillText(
                `Time Bonus: +${bonusPoints}`,
                canvas.width / 2,
                canvas.height / 2 + 30,
            );
        }

        const minutes = Math.floor(window.seconds / 60);
        const remainingSeconds = window.seconds % 60;
        context.fillStyle = "#ffffff";
        context.font = "12px 'Press Start 2P'";
        context.fillText(
            `Play Time: ${minutes}:${remainingSeconds
                .toString()
                .padStart(2, "0")}`,
            canvas.width / 2,
            canvas.height / 2 + 60,
        );
    };

    const gameLoop = (canvas, context) => {
        window.rAF = requestAnimationFrame(() => gameLoop(canvas, context));
        context.clearRect(0, 0, canvas.width, canvas.height);

        context.fillStyle = "#111";
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.strokeStyle = "rgba(50, 50, 50, 0.5)";
        context.lineWidth = 1;

        for (let i = 0; i <= window.X; i++) {
            context.beginPath();
            context.moveTo(i * window.grid, 0);
            context.lineTo(i * window.grid, canvas.height);
            context.stroke();
        }

        for (let i = 0; i <= window.Y; i++) {
            context.beginPath();
            context.moveTo(0, i * window.grid);
            context.lineTo(canvas.width, i * window.grid);
            context.stroke();
        }

        for (let row = 0; row < window.Y; row++) {
            for (let col = 0; col < window.X; col++) {
                if (window.playfield[row][col]) {
                    const name = window.playfield[row][col];
                    context.fillStyle = window.colors[name];
                    context.fillRect(
                        col * window.grid,
                        row * window.grid,
                        window.grid - 1,
                        window.grid - 1,
                    );

                    context.fillStyle = "rgba(255, 255, 255, 0.3)";
                    context.fillRect(
                        col * window.grid,
                        row * window.grid,
                        window.grid - 1,
                        5,
                    );
                    context.fillRect(
                        col * window.grid,
                        row * window.grid,
                        5,
                        window.grid - 1,
                    );

                    context.fillStyle = "rgba(0, 0, 0, 0.3)";
                    context.fillRect(
                        col * window.grid + window.grid - 6,
                        row * window.grid,
                        5,
                        window.grid - 1,
                    );
                    context.fillRect(
                        col * window.grid,
                        row * window.grid + window.grid - 6,
                        window.grid - 1,
                        5,
                    );
                }
            }
        }

        const dropSpeed = Math.max(35 - window.level * 2, 5);

        if (window.tetromino) {
            let ghostRow = window.tetromino.row;
            while (
                isValidMove(
                    window.tetromino.matrix,
                    ghostRow + 1,
                    window.tetromino.col,
                )
            ) {
                ghostRow++;
            }

            context.fillStyle = "rgba(255, 255, 255, 0.2)";
            for (let row = 0; row < window.tetromino.matrix.length; row++) {
                for (
                    let col = 0;
                    col < window.tetromino.matrix[row].length;
                    col++
                ) {
                    if (window.tetromino.matrix[row][col]) {
                        context.fillRect(
                            (window.tetromino.col + col) * window.grid,
                            (ghostRow + row) * window.grid,
                            window.grid - 1,
                            window.grid - 1,
                        );
                    }
                }
            }

            if (++window.count > dropSpeed) {
                window.tetromino.row++;
                window.count = 0;
                if (
                    !isValidMove(
                        window.tetromino.matrix,
                        window.tetromino.row,
                        window.tetromino.col,
                    )
                ) {
                    window.tetromino.row--;
                    placeTetromino(canvas, context);
                }
            }

            context.fillStyle = window.colors[window.tetromino.name];
            for (let row = 0; row < window.tetromino.matrix.length; row++) {
                for (
                    let col = 0;
                    col < window.tetromino.matrix[row].length;
                    col++
                ) {
                    if (window.tetromino.matrix[row][col]) {
                        context.fillRect(
                            (window.tetromino.col + col) * window.grid,
                            (window.tetromino.row + row) * window.grid,
                            window.grid - 1,
                            window.grid - 1,
                        );

                        context.fillStyle = "rgba(255, 255, 255, 0.3)";
                        context.fillRect(
                            (window.tetromino.col + col) * window.grid,
                            (window.tetromino.row + row) * window.grid,
                            window.grid - 1,
                            5,
                        );
                        context.fillRect(
                            (window.tetromino.col + col) * window.grid,
                            (window.tetromino.row + row) * window.grid,
                            5,
                            window.grid - 1,
                        );

                        context.fillStyle = "rgba(0, 0, 0, 0.3)";
                        context.fillRect(
                            (window.tetromino.col + col) * window.grid +
                                window.grid -
                                6,
                            (window.tetromino.row + row) * window.grid,
                            5,
                            window.grid - 1,
                        );
                        context.fillRect(
                            (window.tetromino.col + col) * window.grid,
                            (window.tetromino.row + row) * window.grid +
                                window.grid -
                                6,
                            window.grid - 1,
                            5,
                        );

                        context.fillStyle =
                            window.colors[window.tetromino.name];
                    }
                }
            }
        }

        context.fillStyle = "rgba(0, 0, 0, 0.7)";
        context.fillRect(0, 0, canvas.width, 80);

        context.font = "12px 'Press Start 2P'";
        context.fillStyle = "#00ffaa";
        context.textAlign = "left";
        context.fillText("SCORE:", 10, 20);
        context.fillText("LEVEL:", 10, 45);
        context.fillText("LINES:", 10, 70);

        context.font = "14px 'Press Start 2P'";
        context.fillStyle = "#ffffff";
        context.textAlign = "right";
        context.fillText(score.toString(), canvas.width - 10, 20);
        context.fillText(level.toString(), canvas.width - 10, 45);
        context.fillText(linesCleared.toString(), canvas.width - 10, 70);
    };

    const moveTetris = (direction) => {
        if (window.gameOver) return;

        let col;
        if (direction === "left") {
            col = window.tetromino.col - 1;
        } else {
            col = window.tetromino.col + 1;
        }
        if (isValidMove(window.tetromino.matrix, window.tetromino.row, col)) {
            window.tetromino.col = col;
        }
    };

    const rotateTetris = () => {
        if (window.gameOver) return;

        const matrix = rotate(window.tetromino.matrix);
        if (isValidMove(matrix, window.tetromino.row, window.tetromino.col)) {
            window.tetromino.matrix = matrix;
        } else {
            if (
                isValidMove(
                    matrix,
                    window.tetromino.row,
                    window.tetromino.col + 1,
                )
            ) {
                window.tetromino.col += 1;
                window.tetromino.matrix = matrix;
            } else if (
                isValidMove(
                    matrix,
                    window.tetromino.row,
                    window.tetromino.col - 1,
                )
            ) {
                window.tetromino.col -= 1;
                window.tetromino.matrix = matrix;
            } else if (
                isValidMove(
                    matrix,
                    window.tetromino.row - 1,
                    window.tetromino.col,
                )
            ) {
                window.tetromino.row -= 1;
                window.tetromino.matrix = matrix;
            }
        }
    };

    const fastTetris = () => {
        if (window.gameOver) return;

        const row = window.tetromino.row + 1;
        if (!isValidMove(window.tetromino.matrix, row, window.tetromino.col)) {
            window.tetromino.row = row - 1;
            const canvas = document.getElementById("game");
            const context = canvas.getContext("2d");
            placeTetromino(canvas, context);
            return;
        }
        window.tetromino.row = row;
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (window.gameOver) return;

            if (e.which === 37 || e.which === 39) {
                const direction = e.which === 37 ? "left" : "right";
                moveTetris(direction);
            }
            if (e.which === 38) {
                rotateTetris();
            }
            if (e.which === 40) {
                fastTetris();
            }
            if (e.which === 32) {
                while (
                    isValidMove(
                        window.tetromino.matrix,
                        window.tetromino.row + 1,
                        window.tetromino.col,
                    )
                ) {
                    window.tetromino.row++;
                }
                const canvas = document.getElementById("game");
                const context = canvas.getContext("2d");
                placeTetromino(canvas, context);
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    };

    return (
        <>
            <div
                className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex flex-col items-center justify-start p-4 pb-32"
                style={{
                    backgroundImage: "url('/assets/images/games/TETRIS.png')",
                }}
            >
                {/* Back Button - Top Left */}
                <Link
                    href="/play-and-earn"
                    className="fixed top-4 left-4 z-50 bg-white/50 active:bg-[#039] text-[#039] active:text-white p-3 xs:p-4 rounded-full shadow-xl transition-all duration-200 transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-[#039]/30"
                    style={{ touchAction: "manipulation" }}
                >
                    <ArrowLeft size={24} strokeWidth={2.5} />
                </Link>

                {/* Instructions Modal */}
                {showInstructions && (
                    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-30 p-4">
                        <div className="bg-white text-black p-6 rounded-lg max-w-md w-full">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">
                                    How to Play Tetris
                                </h2>
                                <button
                                    onClick={() => setShowInstructions(false)}
                                    className="text-gray-400 hover:text-black text-3xl leading-none"
                                >
                                    ×
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-4">
                                    <img
                                        src="/assets/icons/arrow.png"
                                        alt="Left Arrow"
                                        className="w-8 h-8"
                                    />
                                    <span>Move Left</span>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <img
                                        src="/assets/icons/right-arrow.png"
                                        alt="Right Arrow"
                                        className="w-8 h-8"
                                    />
                                    <span>Move Right</span>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <img
                                        src="/assets/icons/down-chevron.png"
                                        alt="Down Arrow"
                                        className="w-8 h-8"
                                    />
                                    <span>Move Downwards (Faster Drop)</span>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <img
                                        src="/assets/icons/refresh-arrow.png"
                                        alt="Rotate"
                                        className="w-8 h-8"
                                    />
                                    <span>Rotate Piece</span>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="w-24 h-8 border border-gray-400 flex items-center justify-center rounded-sm bg-gray-100 shadow-inner">
                                        <span className="text-sm text-black">
                                            Space
                                        </span>
                                    </div>
                                    <span>Instant Drop</span>
                                </div>
                            </div>
                            <p className="mt-4 text-black text-sm">
                                Clear lines by filling them completely with
                                blocks. The more lines you clear at once, the
                                more points you earn!
                            </p>
                            <button
                                onClick={() => setShowInstructions(false)}
                                className="mt-6 w-full bg-[#039] text-white py-3 rounded-lg hover:bg-[#027] transition font-bold"
                            >
                                Got it!
                            </button>
                        </div>
                    </div>
                )}

                {/* Game controls */}
                <div id="control">
                    <div className="control-inner">
                        <button
                            onClick={startGame}
                            style={{
                                marginTop: "6px",
                                padding: "12px 24px",
                                backgroundColor: "#039",
                                color: "white",
                                cursor: "pointer",
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                zIndex: 20,
                                display: gameStarted ? "none" : "block",
                                fontSize: "16px",
                                fontWeight: "bold",
                            }}
                            className="rounded-2xl shadow-xl"
                        >
                            Start Game
                        </button>
                    </div>
                </div>

                {/* Game canvas */}
                <div style={{ position: "relative", marginTop: "60px" }}>
                    <canvas width="320" height="600" id="game"></canvas>
                </div>

                {/* Mobile-Optimized Game Controls - Fixed at Bottom */}
                <div id="game-control">
                    {/* Left Controls */}
                    <div style={{ display: "flex", gap: "6px" }}>
                        <button onClick={() => moveTetris("left")}>
                            <img
                                src="/assets/icons/arrow.png"
                                style={{ width: "28px", height: "auto" }}
                                alt="Left Arrow"
                            />
                        </button>
                        <button onClick={() => moveTetris("right")}>
                            <img
                                src="/assets/icons/right-arrow.png"
                                style={{ width: "28px", height: "auto" }}
                                alt="Right Arrow"
                            />
                        </button>
                    </div>

                    {/* Center Control - Exit */}
                    <Link
                        href="/play-and-earn"
                        style={{
                            background: "white",
                            border: "2px solid #444",
                            borderRadius: "12px",
                            width: "48px",
                            height: "48px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            touchAction: "manipulation",
                        }}
                    >
                        <img
                            src="/assets/icons/on-off-button.png"
                            style={{ width: "28px", height: "auto" }}
                            alt="Exit"
                        />
                    </Link>

                    {/* Right Controls */}
                    <div style={{ display: "flex", gap: "6px" }}>
                        <button onClick={fastTetris}>
                            <img
                                src="/assets/icons/down-chevron.png"
                                style={{ width: "28px", height: "auto" }}
                                alt="Down Chevron"
                            />
                        </button>
                        <button onClick={rotateTetris}>
                            <img
                                src="/assets/icons/refresh-arrow.png"
                                style={{ width: "28px", height: "auto" }}
                                alt="Rotate"
                            />
                        </button>
                    </div>
                </div>

                {/* Game over overlay */}
                {gameOver && (
                    <div
                        style={{
                            position: "fixed",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            background: "rgba(0, 0, 0, 0.95)",
                            padding: "30px",
                            borderRadius: "15px",
                            zIndex: 100,
                            textAlign: "center",
                            maxWidth: "90%",
                        }}
                    >
                        <button
                            onClick={restartGame}
                            style={{
                                padding: "12px 30px",
                                background: "#039",
                                color: "white",
                                border: "none",
                                borderRadius: "25px",
                                cursor: "pointer",
                                fontSize: "16px",
                                fontWeight: "bold",
                            }}
                        >
                            Play Again
                        </button>
                    </div>
                )}

                {/* Time Display - Fixed Top Left */}
                <div className="time-container">
                    <div className="score-item">
                        <div className="score-label">TIME</div>
                        <div id="time-value" className="score-value">
                            {formatTime(window.seconds || 0)}
                        </div>
                    </div>
                    {window.seconds >= 300 && (
                        <div className="score-item">
                            <div className="score-label">BONUS</div>
                            <div
                                className="score-value"
                                style={{ color: "#00ff00" }}
                            >
                                +{Math.floor(window.seconds / 10) * 10} pts
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Tetris;
