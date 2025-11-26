<?php

namespace Tests\Feature\Email;

use App\Mail\OrderConfirmation;
use App\Mail\WelcomeEmail;
use App\Models\Order;
use App\Models\User;
use App\Notifications\OrderStatusUpdated;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class EmailNotificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_welcome_email_is_sent_on_user_registration()
    {
        Mail::fake();

        $user = User::factory()->create([
            'email' => 'newuser@example.com',
        ]);

        Mail::to($user->email)->send(new WelcomeEmail($user));

        Mail::assertSent(WelcomeEmail::class, function ($mail) use ($user) {
            return $mail->hasTo($user->email);
        });
    }

    public function test_welcome_email_is_queued_when_user_registers()
    {
        Mail::fake();

        $user = User::factory()->create([
            'email' => 'newuser@example.com',
        ]);

        Mail::assertQueued(WelcomeEmail::class, function ($mail) use ($user) {
            return $mail->hasTo($user->email);
        });
    }

    public function test_welcome_email_contains_user_information()
    {
        Mail::fake();

        $user = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        Mail::assertQueued(WelcomeEmail::class, function ($mail) use ($user) {
            return $mail->user->name === 'Test User' 
                && $mail->user->email === 'test@example.com';
        });
    }

    public function test_welcome_email_has_verification_url_for_unverified_users()
    {
        Mail::fake();

        $user = User::factory()->unverified()->create();

        Mail::assertQueued(WelcomeEmail::class, function ($mail) use ($user) {
            return $mail->user->id === $user->id 
                && $mail->user->email_verified_at === null;
        });
    }

    public function test_multiple_users_receive_separate_welcome_emails()
    {
        Mail::fake();

        $user1 = User::factory()->create(['email' => 'user1@example.com']);
        $user2 = User::factory()->create(['email' => 'user2@example.com']);

        Mail::assertQueued(WelcomeEmail::class, 2);
        
        Mail::assertQueued(WelcomeEmail::class, function ($mail) {
            return $mail->hasTo('user1@example.com');
        });
        
        Mail::assertQueued(WelcomeEmail::class, function ($mail) {
            return $mail->hasTo('user2@example.com');
        });
    }

    public function test_email_queue_connection_is_configured()
    {
        $this->assertEquals('database', config('queue.default'));
    }
}
