<?php

namespace Database\Seeders;

use App\Models\SystemSetting;
use Illuminate\Database\Seeder;

class SystemSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            // ── HOLD CONFIGURATION ──
            [
                'key' => 'default_hold_duration_minutes',
                'value' => 30,
                'description' => 'Default hold duration in minutes',
                'type' => 'integer',
            ],
            [
                'key' => 'min_hold_duration_minutes',
                'value' => 5,
                'description' => 'Minimum allowed hold duration',
                'type' => 'integer',
            ],
            [
                'key' => 'max_hold_duration_minutes',
                'value' => 1440, // 24 hours
                'description' => 'Maximum allowed hold duration',
                'type' => 'integer',
            ],

            // ── WAITLIST CONFIGURATION ──
            [
                'key' => 'waitlist_enabled',
                'value' => true,
                'description' => 'Enable waitlist functionality',
                'type' => 'boolean',
            ],
            [
                'key' => 'waitlist_offer_duration_minutes',
                'value' => 10,
                'description' => 'Duration for which slot offer is valid',
                'type' => 'integer',
            ],
            [
                'key' => 'max_waitlist_size',
                'value' => 1000,
                'description' => 'Maximum waitlist size per experience',
                'type' => 'integer',
            ],

            // ── PAYMENT CONFIGURATION ──
            [
                'key' => 'hold_token_percentage',
                'value' => 25,
                'description' => 'Hold token as percentage of full price',
                'type' => 'integer',
            ],
            [
                'key' => 'min_wallet_balance_for_hold',
                'value' => 100,
                'description' => 'Minimum wallet balance required to create a hold',
                'type' => 'decimal',
            ],

            // ── REFUND CONFIGURATION ──
            [
                'key' => 'refund_policy_on_expiry',
                'value' => 'full',
                'description' => 'Refund policy when hold expires (full/forfeit)',
                'type' => 'string',
            ],
            [
                'key' => 'forfeit_percentage_on_expiry',
                'value' => 0,
                'description' => 'Percentage to forfeit when hold expires (only if policy is partial)',
                'type' => 'integer',
            ],

            // ── NOTIFICATION CONFIGURATION ──
            [
                'key' => 'notify_user_on_hold_expiry',
                'value' => true,
                'description' => 'Send notification when hold is about to expire',
                'type' => 'boolean',
            ],
            [
                'key' => 'notify_user_expiring_soon_minutes',
                'value' => 5,
                'description' => 'Notify user this many minutes before expiry',
                'type' => 'integer',
            ],
            [
                'key' => 'notify_user_on_waitlist_offer',
                'value' => true,
                'description' => 'Send notification when user is offered a slot from waitlist',
                'type' => 'boolean',
            ],

            // ── BOOKING CONFIGURATION ──
            [
                'key' => 'concurrent_holds_per_user',
                'value' => 5,
                'description' => 'Maximum concurrent active holds per user',
                'type' => 'integer',
            ],
            [
                'key' => 'allow_instant_booking',
                'value' => true,
                'description' => 'Allow instant full-payment bookings',
                'type' => 'boolean',
            ],
            [
                'key' => 'allow_hold_booking',
                'value' => true,
                'description' => 'Allow token-based hold bookings',
                'type' => 'boolean',
            ],

            // ── REWARD CONFIGURATION ──
            [
                'key' => 'reward_points_per_booking',
                'value' => 10,
                'description' => 'Reward points awarded per confirmed booking',
                'type' => 'integer',
            ],
            [
                'key' => 'reward_points_per_rupee',
                'value' => 1,
                'description' => 'Reward points awarded per rupee spent',
                'type' => 'decimal',
            ],
        ];

        foreach ($settings as $setting) {
            SystemSetting::updateOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }

        $this->command->info('System settings seeded successfully.');
    }
}
