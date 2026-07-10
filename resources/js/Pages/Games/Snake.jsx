import React, { useState, useEffect, useCallback } from "react";
import { Link } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";
import axios from "axios";

const INITIAL_GRID_SIZE = 18;
const INITIAL_CELL_SIZE = 25;
const INITIAL_SPEED = 200;
const SPEED_DECREASE = 20;
const MIN_SPEED = 50;

const FOOD_ITEMS = [
    { type: "apple", points: 1, color: "bg-red-500", rarity: 0.7 },
    { type: "banana", points: 2, color: "bg-yellow-400", rarity: 0.5 },
    { type: "cherry", points: 3, color: "bg-pink-500", rarity: 0.3 },
    { type: "burger", points: 5, color: "bg-orange-600", rarity: 0.1 },
];

const SnakeGame = () => {
    const [gridSize, setGridSize] = useState(INITIAL_GRID_SIZE);
    const [cellSize, setCellSize] = useState(INITIAL_CELL_SIZE);
    const [showModal, setShowModal] = useState(false);

    // Touch/Swipe state
    const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
    const [mouseStart, setMouseStart] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        const adjustGameSize = () => {
            const screenWidth = window.innerWidth;
            let newGridSize = INITIAL_GRID_SIZE;
            let newCellSize = INITIAL_CELL_SIZE;

            if (screenWidth < 768) {
                newGridSize = 12;
                newCellSize = Math.min(
                    Math.floor((screenWidth - 40) / newGridSize),
                    30,
                );
            } else if (screenWidth < 1024) {
                newGridSize = 15;
                newCellSize = Math.min(
                    Math.floor((screenWidth - 40) / newGridSize),
                    35,
                );
            }

            setGridSize(newGridSize);
            setCellSize(newCellSize);
        };

        adjustGameSize();
        window.addEventListener("resize", adjustGameSize);
        return () => window.removeEventListener("resize", adjustGameSize);
    }, []);

    const [snake, setSnake] = useState([
        { x: Math.floor(gridSize / 2), y: Math.floor(gridSize / 2) },
        { x: Math.floor(gridSize / 2) - 1, y: Math.floor(gridSize / 2) },
        { x: Math.floor(gridSize / 2) - 2, y: Math.floor(gridSize / 2) },
    ]);
    const [food, setFood] = useState({
        x: 5,
        y: 5,
        type: "apple",
        points: 1,
        color: "bg-red-500",
    });
    const [direction, setDirection] = useState("RIGHT");
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [obstacles, setObstacles] = useState([]);
    const [scoreSubmitted, setScoreSubmitted] = useState(false);

    const restartGame = () => {
        setSnake([
            { x: Math.floor(gridSize / 2), y: Math.floor(gridSize / 2) },
            { x: Math.floor(gridSize / 2) - 1, y: Math.floor(gridSize / 2) },
            { x: Math.floor(gridSize / 2) - 2, y: Math.floor(gridSize / 2) },
        ]);
        setScore(0);
        setGameOver(false);
        setObstacles([]);
        setDirection("RIGHT");
        setScoreSubmitted(false);
    };

    useEffect(() => {
        if (!gameOver || scoreSubmitted || score <= 0) return;
        setScoreSubmitted(true);
        axios
            .post("/games/score", { points: score, remark: "Snake" })
            .catch((error) => {
                console.error("Error saving game score:", error);
            });
    }, [gameOver, scoreSubmitted, score]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            e.preventDefault();
            if (gameOver) return;

            switch (e.key) {
                case "ArrowUp":
                    if (direction !== "DOWN") setDirection("UP");
                    break;
                case "ArrowDown":
                    if (direction !== "UP") setDirection("DOWN");
                    break;
                case "ArrowLeft":
                    if (direction !== "RIGHT") setDirection("LEFT");
                    break;
                case "ArrowRight":
                    if (direction !== "LEFT") setDirection("RIGHT");
                    break;
                default:
                    break;
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [direction, gameOver]);

    // Touch event handlers for mobile swipe
    const handleTouchStart = (e) => {
        const touch = e.touches[0];
        setTouchStart({ x: touch.clientX, y: touch.clientY });
    };

    const handleTouchEnd = (e) => {
        if (gameOver) return;

        const touch = e.changedTouches[0];
        const touchEnd = { x: touch.clientX, y: touch.clientY };

        const deltaX = touchEnd.x - touchStart.x;
        const deltaY = touchEnd.y - touchStart.y;

        const minSwipeDistance = 30; // minimum distance for swipe recognition

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Horizontal swipe
            if (Math.abs(deltaX) > minSwipeDistance) {
                if (deltaX > 0 && direction !== "LEFT") {
                    setDirection("RIGHT");
                } else if (deltaX < 0 && direction !== "RIGHT") {
                    setDirection("LEFT");
                }
            }
        } else {
            // Vertical swipe
            if (Math.abs(deltaY) > minSwipeDistance) {
                if (deltaY > 0 && direction !== "UP") {
                    setDirection("DOWN");
                } else if (deltaY < 0 && direction !== "DOWN") {
                    setDirection("UP");
                }
            }
        }
    };

    // Mouse drag event handlers for desktop
    const handleMouseDown = (e) => {
        setIsDragging(true);
        setMouseStart({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = (e) => {
        if (!isDragging || gameOver) {
            setIsDragging(false);
            return;
        }

        const mouseEnd = { x: e.clientX, y: e.clientY };

        const deltaX = mouseEnd.x - mouseStart.x;
        const deltaY = mouseEnd.y - mouseStart.y;

        const minDragDistance = 30; // minimum distance for drag recognition

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Horizontal drag
            if (Math.abs(deltaX) > minDragDistance) {
                if (deltaX > 0 && direction !== "LEFT") {
                    setDirection("RIGHT");
                } else if (deltaX < 0 && direction !== "RIGHT") {
                    setDirection("LEFT");
                }
            }
        } else {
            // Vertical drag
            if (Math.abs(deltaY) > minDragDistance) {
                if (deltaY > 0 && direction !== "UP") {
                    setDirection("DOWN");
                } else if (deltaY < 0 && direction !== "DOWN") {
                    setDirection("UP");
                }
            }
        }

        setIsDragging(false);
    };

    // Simplified moveSnake function for brevity
    const moveSnake = useCallback(() => {
        if (gameOver) return;

        setSnake((prevSnake) => {
            const newSnake = [...prevSnake];
            const head = { ...newSnake[0] };

            switch (direction) {
                case "UP":
                    head.y -= 1;
                    break;
                case "DOWN":
                    head.y += 1;
                    break;
                case "LEFT":
                    head.x -= 1;
                    break;
                case "RIGHT":
                    head.x += 1;
                    break;
            }

            if (
                head.x < 0 ||
                head.x >= gridSize ||
                head.y < 0 ||
                head.y >= gridSize ||
                newSnake.some((seg) => seg.x === head.x && seg.y === head.y) ||
                obstacles.some((obs) => obs.x === head.x && obs.y === head.y)
            ) {
                setGameOver(true);
                return prevSnake;
            }

            if (head.x === food.x && head.y === food.y) {
                setScore((prevScore) => {
                    const newScore = prevScore + food.points;
                    if (newScore % 10 === 0) {
                        setObstacles(generateObstacles(newScore));
                    }
                    return newScore;
                });
                setFood(generateFood());
                newSnake.unshift(head);
            } else {
                newSnake.unshift(head);
                newSnake.pop();
            }

            return newSnake;
        });
    }, [direction, food, gameOver, obstacles, gridSize]);

    useEffect(() => {
        const gameInterval = setInterval(moveSnake, INITIAL_SPEED);
        return () => clearInterval(gameInterval);
    }, [moveSnake]);

    // Placeholder generateFood and generateObstacles for UI example
    function generateFood() {
        return {
            x: Math.floor(Math.random() * gridSize),
            y: Math.floor(Math.random() * gridSize),
            type: "apple",
            points: 1,
            color: "bg-red-500",
        };
    }

    function generateObstacles(currentScore) {
        return [];
    }

    return (
        <>
            <div
                id="snake-game-container"
                className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#f0f4ff] to-[#e6ecfa] p-4 relative"
                style={{
                    backgroundImage: "url('/assets/images/games/SNAKE.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
            >
                {/* Back Button */}
                <Link
                    href="/play-and-earn"
                    className="fixed top-4 left-4 z-50 bg-white/50 active:bg-[#003399] text-[#003399] active:text-white p-3 xs:p-4 rounded-full shadow-xl transition-all duration-200 transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-[#003399]/30"
                    style={{ touchAction: "manipulation" }}
                >
                    <ArrowLeft size={24} strokeWidth={2.5} />
                </Link>

                {gameOver ? (
                    <div className="text-center bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 mt-[60px] border-2 border-[#003399]">
                        <h2 className="text-3xl font-bold mb-4 text-[#003399]">
                            Game Over!
                        </h2>
                        <p className="text-xl mb-6 text-[#003399] font-semibold">
                            Your Score: {score}
                        </p>
                        <button
                            onClick={restartGame}
                            className="bg-gradient-to-r from-[#003399] to-[#0055cc] text-white rounded-full px-8 py-3 font-semibold shadow-lg hover:from-[#0055cc] hover:to-[#0073e6] transition-colors duration-300 active:scale-95 focus:outline-none focus:ring-4 focus:ring-[#003399]/50"
                        >
                            Restart Game
                        </button>
                    </div>
                ) : (
                    <>
                        <div
                            className="relative border-4 border-[#003399] bg-white rounded-3xl shadow-inner mt-[60px]"
                            style={{
                                width: `${gridSize * cellSize}px`,
                                height: `${gridSize * cellSize}px`,
                                maxWidth: "100%",
                                cursor: isDragging ? "grabbing" : "grab",
                                userSelect: "none",
                            }}
                        >
                            {snake.map((segment, idx) => (
                                <div
                                    key={idx}
                                    className={`absolute bg-[#003399] rounded-full`}
                                    style={{
                                        width: `${cellSize}px`,
                                        height: `${cellSize}px`,
                                        left: `${segment.x * cellSize}px`,
                                        top: `${segment.y * cellSize}px`,
                                    }}
                                />
                            ))}
                            <div
                                className={`${food.color} absolute rounded-full`}
                                style={{
                                    width: `${cellSize}px`,
                                    height: `${cellSize}px`,
                                    left: `${food.x * cellSize}px`,
                                    top: `${food.y * cellSize}px`,
                                }}
                                title={`${food.type} (+${food.points} points)`}
                            />
                            {obstacles.map((obs, idx) => (
                                <div
                                    key={idx}
                                    className="absolute bg-purple-500 rounded"
                                    style={{
                                        width: `${cellSize}px`,
                                        height: `${cellSize}px`,
                                        left: `${obs.x * cellSize}px`,
                                        top: `${obs.y * cellSize}px`,
                                    }}
                                />
                            ))}
                        </div>
                        <div className="mt-4 text-lg font-bold text-[#003399]">
                            Score: {score} | Current Food: {food.type} (+
                            {food.points})
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default SnakeGame;
