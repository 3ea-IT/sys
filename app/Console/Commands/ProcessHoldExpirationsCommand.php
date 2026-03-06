<?php

namespace App\Console\Commands;

use App\Jobs\ProcessHoldExpirations;
use Illuminate\Console\Command;

class ProcessHoldExpirationsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'holds:process-expirations';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Process expired holds, refund tokens, and offer to waitlist';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Processing hold expirations...');

        try {
            // Dispatch the job
            ProcessHoldExpirations::dispatch();
            
            $this->info('Hold expiration job dispatched successfully.');
            return Command::SUCCESS;
        } catch (\Exception $e) {
            $this->error('Error processing expirations: ' . $e->getMessage());
            return Command::FAILURE;
        }
    }
}
