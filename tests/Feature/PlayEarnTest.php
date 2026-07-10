<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Tests\TestCase;

class PlayEarnTest extends TestCase
{
    public function test_authenticated_user_can_view_play_and_earn_page(): void
    {
        $user = User::create([
            'name' => 'Test User',
            'email' => 'playearn-' . Str::random(8) . '@example.com',
            'password' => Hash::make('password123'),
        ]);

        $response = $this->actingAs($user)->get('/play-and-earn');

        $response->assertOk();
    }

    public function test_wallet_page_creates_wallet_for_user(): void
    {
        $user = User::create([
            'name' => 'Wallet User',
            'email' => 'wallet-' . Str::random(8) . '@example.com',
            'password' => Hash::make('password123'),
        ]);

        $response = $this->actingAs($user)->get('/wallet');

        $response->assertOk();
        $this->assertNotNull($user->fresh()->wallet);
    }

    public function test_play_and_earn_controller_returns_wallet_activity(): void
    {
        $user = User::create([
            'name' => 'Activity User',
            'email' => 'activity-' . Str::random(8) . '@example.com',
            'password' => Hash::make('password123'),
        ]);

        $wallet = $user->wallet()->create(['balance' => 0]);
        $wallet->transactions()->create([
            'amount' => 10,
            'type' => 'credit',
            'description' => 'Game reward: Snake',
        ]);

        $response = $this->actingAs($user)->get('/play-and-earn');

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->where('walletBalance', 10)
            ->where('activityLogs.0.remark', 'Game reward: Snake')
        );
    }
}
