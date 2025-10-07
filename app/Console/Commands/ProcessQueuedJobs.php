<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;

class ProcessQueuedJobs extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'queue:process-jobs {--timeout=60 : Timeout in seconds}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Process queued jobs for shared hosting environments';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $timeout = $this->option('timeout');

        $this->info('Processing queued jobs...');

        try {
            // Process jobs until queue is empty or timeout is reached
            Artisan::call('queue:work', [
                '--stop-when-empty' => true,
                '--tries' => 3,
                '--timeout' => $timeout,
                '--verbose' => true,
            ]);

            $output = Artisan::output();
            $this->info('Queue processing completed.');
            $this->line($output);

        } catch (\Exception $e) {
            $this->error('Queue processing failed: ' . $e->getMessage());
            return 1;
        }

        return 0;
    }
}
