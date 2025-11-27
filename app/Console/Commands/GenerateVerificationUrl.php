<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\URL;

class GenerateVerificationUrl extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:verification-url {email}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate email verification URL for a user';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email');

        $user = User::where('email', $email)->first();

        if (!$user) {
            $this->error("User with email '{$email}' not found.");
            return 1;
        }

        $url = URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(60),
            ['id' => $user->id, 'hash' => sha1($user->email)]
        );

        $this->info("Verification URL for {$user->name} ({$user->email}):");
        $this->line($url);
        $this->newLine();
        $this->info("Copy this URL and use it in Postman or browser to verify the email.");

        return 0;
    }
}

