<?php

namespace App\Jobs;

use App\Models\Hold;
use App\Models\Waitlist;
use App\Events\HoldExpired;
use App\Events\HoldExpiringSoon;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ProcessHoldExpirations implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $this->processExpiredHolds();
        $this->processExpiringHolds();
    }

    /**
     * Process holds that have actually expired
     * Auto-expire them, refund token, and offer to waitlist
     */
    private function processExpiredHolds()
    {
        $expiredHolds = Hold::expired()->get();

        foreach ($expiredHolds as $hold) {
            // Auto-expire the hold
            $hold->autoExpire('system_auto_expired');

            // Fire event for notifications
            event(new HoldExpired($hold));

            // Refund the token amount to wallet
            $this->refundTokenToWallet($hold);

            // Try to offer the slot to the next person in waitlist
            $this->offerToNextWaitlistent($hold->experience_id);
        }
    }

    /**
     * Send notifications for holds expiring soon
     */
    private function processExpiringHolds()
    {
        $expiringHolds = Hold::expiringSoon(5)->get(); // 5 minutes threshold

        foreach ($expiringHolds as $hold) {
            // Fire event for notifications
            event(new HoldExpiringSoon($hold));

            // Mark as notified if not already
            if (!$hold->expiring_notified_at) {
                $hold->update(['expiring_notified_at' => Carbon::now()]);
            }
        }
    }

    /**
     * Refund hold token to user's wallet
     */
    private function refundTokenToWallet(Hold $hold)
    {
        $wallet = $hold->user->wallet;
        $refundAmount = $hold->experience->hold_token;

        if ($wallet) {
            $wallet->increment('balance', $refundAmount);

            // Log transaction
            \App\Models\WalletTransaction::create([
                'wallet_id' => $wallet->id,
                'type' => 'refund',
                'amount' => $refundAmount,
                'description' => "Hold refund for {$hold->experience->title} (Expired)",
                'reference_id' => $hold->id,
                'reference_type' => 'hold',
            ]);
        }
    }

    /**
     * Offer the slot to next person in waitlist
     */
    private function offerToNextWaitlistent($experienceId)
    {
        $nextInQueue = Waitlist::getNextInQueue($experienceId);

        if ($nextInQueue) {
            // Get waitlist offer duration from settings (default 10 minutes)
            $offerDurationMinutes = \App\Models\SystemSetting::get(
                'waitlist_offer_duration_minutes',
                10
            );

            $nextInQueue->makeOffer($offerDurationMinutes);

            // TODO: Send push/email notification to user about the offer
        }
    }
}
