import React, { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";
import axios from "axios";

const TicTacToe = () => {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [isXNext, setIsXNext] = useState(true);
    const [winner, setWinner] = useState(null);
    const [gameOver, setGameOver] = useState(false);
    const [computerThinking, setComputerThinking] = useState(false);
    const [stats, setStats] = useState({ wins: 0, losses: 0, draws: 0 });
    const [showConfetti, setShowConfetti] = useState(false);
    const [winningLine, setWinningLine] = useState([]);

    // Reset game state
    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setIsXNext(true);
        setWinner(null);
        setGameOver(false);
        setShowConfetti(false);
        setWinningLine([]);
    };

    // Check for winner
    const calculateWinner = (squares) => {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];

        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (
                squares[a] &&
                squares[a] === squares[b] &&
                squares[a] === squares[c]
            ) {
                return { winner: squares[a], line: lines[i] };
            }
        }

        if (!squares.includes(null)) {
            return { winner: "draw", line: [] };
        }

        return null;
    };

    // AI best move calculation
    const getBestMove = (squares) => {
        let cellRank = [3, 2, 3, 2, 4, 2, 3, 2, 3];

        for (let i = 0; i < squares.length; i++) {
            if (squares[i] !== null) {
                cellRank[i] -= 99;
            }
        }

        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];

        for (let combo = 0; combo < lines.length; combo++) {
            const [a, b, c] = lines[combo];

            if (
                squares[a] === squares[b] &&
                squares[a] !== null &&
                squares[c] === null
            ) {
                cellRank[c] += squares[a] === "O" ? 20 : 10;
            }
            if (
                squares[a] === squares[c] &&
                squares[a] !== null &&
                squares[b] === null
            ) {
                cellRank[b] += squares[a] === "O" ? 20 : 10;
            }
            if (
                squares[b] === squares[c] &&
                squares[b] !== null &&
                squares[a] === null
            ) {
                cellRank[a] += squares[b] === "O" ? 20 : 10;
            }
        }

        let bestCell = -1;
        let highest = -999;
        for (let j = 0; j < squares.length; j++) {
            if (cellRank[j] > highest) {
                highest = cellRank[j];
                bestCell = j;
            }
        }

        return bestCell;
    };

    // Handle player move
    const handleClick = (index) => {
        if (board[index] || gameOver || computerThinking) return;

        const newBoard = [...board];
        newBoard[index] = "X";
        setBoard(newBoard);
        setIsXNext(false);

        const result = calculateWinner(newBoard);
        if (result) {
            handleGameEnd(result);
        } else {
            setComputerThinking(true);
            setTimeout(() => {
                const computerMove = getBestMove(newBoard);
                const updatedBoard = [...newBoard];
                updatedBoard[computerMove] = "O";
                setBoard(updatedBoard);

                const finalResult = calculateWinner(updatedBoard);

                if (finalResult) {
                    handleGameEnd(finalResult);
                } else {
                    setIsXNext(true);
                }
                setComputerThinking(false);
            }, 600);
        }
    };

    // Handle game end
    const handleGameEnd = async (result) => {
        setGameOver(true);
        setWinner(result.winner);
        setWinningLine(result.line);

        if (result.winner === "X") {
            setStats((prev) => ({ ...prev, wins: prev.wins + 1 }));
            setShowConfetti(true);
            const points = 2;
            const remark = "Tictactoe";
            const response = await axios.post(`/games/score`, {
                points,
                remark,
            });

            console.log(response);
        } else if (result.winner === "O") {
            setStats((prev) => ({ ...prev, losses: prev.losses + 1 }));
        } else {
            setStats((prev) => ({ ...prev, draws: prev.draws + 1 }));
        }
    };

    // Render square
    const renderSquare = (index) => {
        const isWinningSquare = winningLine.includes(index);
        return (
            <button
                className={`
                    w-[80px] h-[80px]
                    xs:w-[90px] xs:h-[90px]
                    sm:w-[100px] sm:h-[100px]
                    text-3xl xs:text-4xl sm:text-5xl 
                    font-bold 
                    rounded-2xl 
                    transition-all duration-300 
                    transform active:scale-95
                    focus:outline-none focus:ring-4 focus:ring-[#003399]/30
                    ${
                        board[index]
                            ? isWinningSquare
                                ? "bg-gradient-to-br from-[#003399] to-[#0055cc] text-white shadow-xl scale-105"
                                : "bg-gradient-to-br from-white to-[#e6ecfa] border-2 border-[#003399]"
                            : "bg-white active:bg-gradient-to-br active:from-white active:to-[#f0f4ff] border-2 border-gray-300"
                    }
                    ${board[index] === "X" ? "text-[#003399]" : ""}
                    ${board[index] === "O" ? "text-[#ee2737]" : ""}
                    shadow-md active:shadow-xl
                    disabled:cursor-not-allowed
                `}
                onClick={() => handleClick(index)}
                disabled={!!board[index] || gameOver || computerThinking}
            >
                <span className={`${board[index] ? "animate-scaleIn" : ""}`}>
                    {board[index]}
                </span>
            </button>
        );
    };

    // Confetti component
    const Confetti = () => {
        if (!showConfetti) return null;

        const confettiPieces = [];
        for (let i = 0; i < 50; i++) {
            const colors = ["#003399", "#0055cc", "#ee2737", "#FFD700"];
            const style = {
                left: `${Math.random() * 100}%`,
                top: `-${Math.random() * 20}%`,
                animationDelay: `${Math.random() * 2}s`,
                backgroundColor:
                    colors[Math.floor(Math.random() * colors.length)],
            };
            confettiPieces.push(
                <div
                    key={i}
                    className="absolute w-2 h-2 sm:w-3 sm:h-3 rounded-full animate-fall opacity-80"
                    style={style}
                />,
            );
        }

        return (
            <div className="fixed inset-0 pointer-events-none z-30">
                {confettiPieces}
            </div>
        );
    };

    // Win Modal
    const WinModal = () => {
        if (!gameOver) return null;

        let modalContent;
        if (winner === "X") {
            modalContent = {
                title: "🎉 Victory!",
                message: "+2 points earned",
                bgColor:
                    "bg-gradient-to-br from-[#003399] via-[#0055cc] to-[#0066dd]",
                textColor: "text-white",
                animation: "animate-win",
                icon: "🏆",
            };
        } else if (winner === "O") {
            modalContent = {
                title: "AI Wins",
                message: "Try again!",
                bgColor: "bg-gradient-to-br from-gray-700 to-gray-900",
                textColor: "text-white",
                animation: "animate-fadeIn",
                icon: "🤖",
            };
        } else {
            modalContent = {
                title: "Draw Game",
                message: "Well played!",
                bgColor: "bg-gradient-to-br from-gray-100 to-gray-200",
                textColor: "text-[#003399]",
                animation: "animate-fadeIn",
                icon: "🤝",
            };
        }

        return (
            <>
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-30 rounded-2xl">
                    <div
                        className={`${modalContent.bgColor} ${modalContent.animation} rounded-2xl p-6 xs:p-8 shadow-2xl transform transition-all duration-300 w-[90%] max-w-sm mx-auto`}
                    >
                        <div className="text-5xl xs:text-6xl text-center mb-3 xs:mb-4">
                            {modalContent.icon}
                        </div>
                        <h2
                            className={`${modalContent.textColor} text-2xl xs:text-3xl font-bold text-center mb-2 xs:mb-3`}
                        >
                            {modalContent.title}
                        </h2>
                        <p
                            className={`${modalContent.textColor} text-center mb-5 xs:mb-6 text-base xs:text-lg opacity-90`}
                        >
                            {modalContent.message}
                        </p>
                        <button
                            onClick={resetGame}
                            className="w-full bg-white text-[#003399] font-bold py-3 xs:py-4 px-6 rounded-full shadow-lg active:shadow-xl transition-all duration-300 transform active:scale-95 text-base xs:text-lg"
                        >
                            Play Again
                        </button>
                    </div>
                </div>
            </>
        );
    };

    return (
        <>
            <div className="min-h-screen flex flex-col justify-center items-center p-4 xs:p-5 bg-gradient-to-br from-[#f0f4ff] via-white to-[#e6ecfa] safe-area-inset">
                <style>
                    {`
                      @keyframes fall {
                        0% { transform: translateY(-100vh) rotate(0deg) scale(1); opacity: 1; }
                        100% { transform: translateY(100vh) rotate(720deg) scale(0.5); opacity: 0; }
                      }
                      .animate-fall {
                        animation: fall 4s linear forwards;
                      }
                      @keyframes win {
                        0% { transform: scale(0.5) rotate(-10deg); opacity: 0; }
                        60% { transform: scale(1.1) rotate(5deg); }
                        100% { transform: scale(1) rotate(0deg); opacity: 1; }
                      }
                      .animate-win {
                        animation: win 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                      }
                      @keyframes fadeIn {
                        0% { opacity: 0; transform: translateY(-20px); }
                        100% { opacity: 1; transform: translateY(0); }
                      }
                      .animate-fadeIn {
                        animation: fadeIn 0.4s ease-out forwards;
                      }
                      @keyframes scaleIn {
                        0% { transform: scale(0) rotate(-180deg); }
                        70% { transform: scale(1.2) rotate(10deg); }
                        100% { transform: scale(1) rotate(0deg); }
                      }
                      .animate-scaleIn {
                        animation: scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                      }
                      .safe-area-inset {
                        padding-top: env(safe-area-inset-top);
                        padding-bottom: env(safe-area-inset-bottom);
                      }
                    `}
                </style>

                <Confetti />

                {/* Back Button - Thumb-friendly bottom position for mobile */}
                <Link
                    href="/play-and-earn"
                    className="fixed top-4 left-4 z-50 bg-white/50 active:bg-[#003399] text-[#003399] active:text-white p-3 xs:p-4 rounded-full shadow-xl transition-all duration-200 transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-[#003399]/30"
                    style={{ touchAction: "manipulation" }}
                >
                    <ArrowLeft size={24} strokeWidth={2.5} />
                </Link>

                <div className="w-full max-w-[400px] px-3 xs:px-4 py-5 xs:py-6 bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200 relative overflow-hidden">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-24 h-24 xs:w-32 xs:h-32 bg-[#003399]/5 rounded-full blur-3xl -z-10"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 xs:w-32 xs:h-32 bg-[#ee2737]/5 rounded-full blur-3xl -z-10"></div>

                    {/* Header */}
                    <div className="text-center mb-4 xs:mb-5">
                        <div className="bg-gradient-to-r from-[#003399] to-[#0055cc] text-white py-2 xs:py-3 px-5 xs:px-6 rounded-full inline-block shadow-lg mb-2 xs:mb-3">
                            <h1 className="text-xl xs:text-2xl font-bold">
                                Tic Tac Toe
                            </h1>
                        </div>
                        <p className="text-gray-600 text-xs xs:text-sm">
                            Challenge the AI
                        </p>
                    </div>

                    {/* Stats - Optimized for thumb reach */}
                    <div className="mb-4 xs:mb-5 flex justify-between items-center gap-2">
                        <div className="flex-1 text-center px-2 xs:px-3 py-2 rounded-xl bg-gradient-to-br from-[#003399] to-[#0055cc] text-white shadow-md">
                            <div className="text-[10px] xs:text-xs font-medium opacity-90">
                                You
                            </div>
                            <div className="text-lg xs:text-xl font-bold">
                                {stats.wins}
                            </div>
                        </div>
                        <div className="flex-1 text-center px-2 xs:px-3 py-2 rounded-xl bg-gray-100 text-gray-800 shadow-md">
                            <div className="text-[10px] xs:text-xs font-medium">
                                Draws
                            </div>
                            <div className="text-lg xs:text-xl font-bold">
                                {stats.draws}
                            </div>
                        </div>
                        <div className="flex-1 text-center px-2 xs:px-3 py-2 rounded-xl bg-gradient-to-br from-gray-700 to-gray-900 text-white shadow-md">
                            <div className="text-[10px] xs:text-xs font-medium opacity-90">
                                AI
                            </div>
                            <div className="text-lg xs:text-xl font-bold">
                                {stats.losses}
                            </div>
                        </div>
                    </div>

                    {/* Game Board - Centered and optimized */}
                    <div className="relative mb-4 xs:mb-5">
                        {computerThinking && (
                            <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-20 rounded-2xl">
                                <div className="flex flex-col items-center space-y-2 xs:space-y-3">
                                    <div className="text-lg xs:text-xl font-bold text-[#003399]">
                                        AI Thinking
                                    </div>
                                    <div className="flex space-x-2">
                                        <div
                                            className="w-2.5 h-2.5 xs:w-3 xs:h-3 bg-[#003399] rounded-full animate-bounce"
                                            style={{ animationDelay: "0s" }}
                                        ></div>
                                        <div
                                            className="w-2.5 h-2.5 xs:w-3 xs:h-3 bg-[#0055cc] rounded-full animate-bounce"
                                            style={{ animationDelay: "0.15s" }}
                                        ></div>
                                        <div
                                            className="w-2.5 h-2.5 xs:w-3 xs:h-3 bg-[#ee2737] rounded-full animate-bounce"
                                            style={{ animationDelay: "0.3s" }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-3 gap-2 xs:gap-3 p-3 xs:p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-inner">
                            {Array(9)
                                .fill(null)
                                .map((_, i) => (
                                    <div key={i}>{renderSquare(i)}</div>
                                ))}
                        </div>
                    </div>

                    <WinModal />

                    {/* Turn Indicator */}
                    <div className="text-center mb-4 xs:mb-5">
                        {!gameOver && (
                            <div
                                className={`inline-block px-4 xs:px-6 py-2 rounded-full text-sm xs:text-base ${
                                    isXNext
                                        ? "bg-[#003399]/10 text-[#003399]"
                                        : "bg-gray-100 text-gray-700"
                                } font-semibold transition-all duration-300`}
                            >
                                {isXNext ? "Your Turn ⚡" : "AI's Turn 🤖"}
                            </div>
                        )}
                    </div>

                    {/* Restart Button - Positioned in thumb-friendly zone */}
                    {!gameOver && (
                        <div className="flex justify-center">
                            <button
                                onClick={resetGame}
                                className="px-6 xs:px-8 py-3 xs:py-4 bg-gradient-to-r from-[#003399] to-[#0055cc] text-white font-bold rounded-full shadow-lg active:shadow-xl transition-all duration-200 transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-[#003399]/30 text-sm xs:text-base"
                                style={{ touchAction: "manipulation" }}
                            >
                                New Game
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default TicTacToe;
