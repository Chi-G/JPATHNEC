<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class NewsletterSubscriptionConfirmation extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;
    public $email;
    public $token;

    public function __construct(string $email, ?string $token = null)
    {
        $this->email = $email;
        $this->token = $token;
    }

    public function build()
    {
        return $this->subject('Thanks for subscribing to ' . config('app.name'))
            ->view('newsletter.newsletter_subscription')
            ->with([
                'email' => $this->email,
                'token' => $this->token, 
                'appName' => config('app.name'),
                'logoUrl' => asset('logo.svg'),
                // Build an explicit unsubscribe URL using the backend app URL to avoid
                // accidentally pointing at the frontend dev server (e.g. Vite on :5173).
                'unsubscribeUrl' => rtrim(config('app.url'), '/') . '/newsletter/unsubscribe/' . $this->token,
            ]);
    }
}
 