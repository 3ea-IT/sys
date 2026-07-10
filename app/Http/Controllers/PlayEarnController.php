<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PlayEarnController extends Controller
{
    private function getWalletBalance($wallet): float
    {
        if (! $wallet) {
            return 0.0;
        }

        return (float) $wallet->balance;
    }

    public function index()
    {
        $games = [
            [
                'name' => 'TicTacToe',
                'route' => '/games/tictactoe',
                'image' => '/assets/games/tictactoe.png',
                'description' => 'Classic TicTacToe game. Win to earn points!',
            ],
            [
                'name' => 'Snake',
                'route' => '/games/snake',
                'image' => '/assets/games/snake.png',
                'description' => 'Eat food, grow your snake, and earn points!',
            ],
            [
                'name' => 'Tetris',
                'route' => '/games/tetris',
                'image' => '/assets/games/tetris.png',
                'description' => 'Stack blocks, clear lines, and earn points!',
            ],
            [
                'name' => 'Quizz',
                'route' => '/games/quizz',
                'image' => '/assets/games/quizz.png',
                'description' => 'Answer quiz questions and earn points!',
            ],
        ];

        $user = Auth::user();
        $wallet = $user ? $user->wallet()->firstOrCreate(['user_id' => $user->id], ['balance' => 0]) : null;
        $walletBalance = $this->getWalletBalance($wallet);

        $activityLogs = $wallet
            ? $wallet->transactions()
                ->orderByDesc('created_at')
                ->get()
                ->map(function ($transaction) {
                    return [
                        'id' => $transaction->id,
                        'points' => (int) $transaction->amount,
                        'type' => $transaction->type === 'credit' ? 'CR' : 'DR',
                        'remark' => $transaction->description,
                        'source' => $transaction->description,
                        'date' => $transaction->created_at,
                    ];
                })
            : collect([]);

        return Inertia::render('Games/PlayAndEarn', [
            'games' => $games,
            'walletBalance' => $walletBalance,
            'activityLogs' => $activityLogs,
            'auth' => [
                'user' => [
                    'id' => $user?->id,
                    'name' => $user?->name,
                    'wallet' => [
                        'balance' => $walletBalance,
                    ],
                    'wallet_balance' => $walletBalance,
                ],
            ],
        ]);
    }

    public function reward(Request $request)
    {
        $request->validate([
            'game' => 'sometimes|string',
            'points' => 'required|integer|min:1',
            'remark' => 'sometimes|string',
        ]);

        $user = Auth::user();
        if (! $user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $wallet = $user->wallet()->firstOrCreate(['user_id' => $user->id], ['balance' => 0]);
        $wallet->balance += (int) $request->input('points', 0);
        $wallet->save();

        $wallet->transactions()->create([
            'amount' => (int) $request->input('points', 0),
            'type' => 'credit',
            'description' => $request->input('remark', $request->input('game', 'Play & Earn')),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Game points saved successfully',
            'wallet_balance' => (float) $wallet->fresh()->balance,
        ]);
    }

    public function saveGame(Request $request)
    {
        $user = Auth::user();
        if (! $user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $points = (int) $request->input('points', 0);
        $wallet = $user->wallet()->firstOrCreate(['user_id' => $user->id], ['balance' => 0]);
        $wallet->balance += $points;
        $wallet->save();

        $wallet->transactions()->create([
            'amount' => $points,
            'type' => 'credit',
            'description' => $request->input('remark', 'Play & Earn'),
        ]);

        return response()->json(['success' => true, 'message' => 'Game points saved successfully!']);
    }

    public function getQuestionnaires()
    {
        return response()->json([]);
    }
}
