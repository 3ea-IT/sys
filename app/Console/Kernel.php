<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        // Process hold expirations every 5 minutes
        // This checks for expired holds, refunds tokens, and offers slots to waitlist
        $schedule->command('holds:process-expirations')
            ->everyFiveMinutes()
            ->withoutOverlapping()
            ->onSuccess(function () {
                \Log::info('Hold expiration processing completed successfully');
            })
            ->onFailure(function () {
                \Log::error('Hold expiration processing failed');
            });
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
