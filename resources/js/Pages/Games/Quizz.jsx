import { useMemo, useState } from 'react';
import axios from 'axios';
import GameShell from './GameShell';

const questions = [
    {
        question: 'Which city is known as the City of Joy?',
        options: ['Mumbai', 'Kolkata', 'Delhi', 'Bengaluru'],
        answer: 1,
    },
    {
        question: 'What is the capital of India?',
        options: ['Mumbai', 'Delhi', 'Chennai', 'Hyderabad'],
        answer: 1,
    },
    {
        question: 'How many days are there in a leap year?',
        options: ['364', '365', '366', '367'],
        answer: 2,
    },
    {
        question: 'Which planet is known as the Red Planet?',
        options: ['Mercury', 'Venus', 'Mars', 'Jupiter'],
        answer: 2,
    },
    {
        question: 'Who wrote the Indian National Anthem?',
        options: ['Rabindranath Tagore', 'Bankim Chandra Chattopadhyay', 'M. K. Gandhi', 'Subhas Chandra Bose'],
        answer: 0,
    },
];

export default function Quiz() {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [score, setScore] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);
    const [rewardSent, setRewardSent] = useState(false);

    const awardPoints = async () => {
        if (rewardSent) return;
        setRewardSent(true);
        try {
            await axios.post('/games/score', { points: score >= 3 ? 8 : 5, remark: 'Quiz' });
        } catch (error) {
            console.error('Failed to save game score', error);
        }
    };

    const handleAnswer = (index) => {
        if (selectedAnswer !== null) return;
        setSelectedAnswer(index);
        if (index === questions[currentQuestion].answer) {
            setScore((prev) => prev + 1);
        }
    };

    const nextQuestion = () => {
        if (currentQuestion === questions.length - 1) {
            setIsCompleted(true);
            awardPoints();
            return;
        }

        setCurrentQuestion((prev) => prev + 1);
        setSelectedAnswer(null);
    };

    const resetGame = () => {
        setCurrentQuestion(0);
        setSelectedAnswer(null);
        setScore(0);
        setIsCompleted(false);
        setRewardSent(false);
    };

    const progress = useMemo(() => `${currentQuestion + 1}/${questions.length}`, [currentQuestion]);

    return (
        <GameShell title="Quiz" description="Answer a quick set of questions and collect your reward." points={8}>
            <div className="flex flex-col gap-4">
                {!isCompleted ? (
                    <>
                        <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                            Question {progress} • Score {score}
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white p-4">
                            <p className="text-lg font-semibold text-slate-900">{questions[currentQuestion].question}</p>
                            <div className="mt-4 space-y-2">
                                {questions[currentQuestion].options.map((option, index) => {
                                    const isCorrect = selectedAnswer !== null && index === questions[currentQuestion].answer;
                                    const isWrong = selectedAnswer === index && selectedAnswer !== questions[currentQuestion].answer;
                                    return (
                                        <button
                                            key={option}
                                            type="button"
                                            onClick={() => handleAnswer(index)}
                                            disabled={selectedAnswer !== null}
                                            className={`w-full rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${isCorrect ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : isWrong ? 'border-rose-500 bg-rose-50 text-rose-700' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
                                        >
                                            {option}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button type="button" onClick={nextQuestion} disabled={selectedAnswer === null} className="rounded-full bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300">
                                {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next'}
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center">
                        <h2 className="text-xl font-semibold text-emerald-700">Quiz complete</h2>
                        <p className="mt-2 text-sm text-emerald-600">You scored {score} out of {questions.length} and earned your reward.</p>
                        <button type="button" onClick={resetGame} className="mt-4 rounded-full bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white">Try again</button>
                    </div>
                )}
            </div>
        </GameShell>
    );
}
