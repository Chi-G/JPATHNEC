<?php

namespace App\Http\Controllers;

use App\Http\Requests\NewsletterSubscribeRequest;
use App\Models\NewsletterSubscriber;
use App\Mail\NewsletterSubscriptionConfirmation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class NewsletterController extends Controller
{
  /**
   * Handle newsletter subscription form.
   * Validates the request, stores the subscriber, and queues confirmation email.
   */
  public function store(NewsletterSubscribeRequest $request): RedirectResponse
  { 
    $email = strtolower($request->input('email')); 
    $token = bin2hex(random_bytes(20));

    $existing = NewsletterSubscriber::where('email', $email)->first();
    $wasPreviouslyUnsubscribed = $existing && $existing->unsubscribed_at !== null;

    NewsletterSubscriber::updateOrCreate(
      ['email' => $email],
      ['subscribed_at' => now(), 'unsubscribe_token' => $token, 'unsubscribed_at' => null]
    );

    $flashMessage = 'Thanks — your subscription was received.';
    $shouldSendEmail = false;

    if (! $existing) {
      $shouldSendEmail = true;
      $flashMessage = 'Thanks — your subscription was received.';
    } elseif ($wasPreviouslyUnsubscribed) {
      $shouldSendEmail = true;
      $flashMessage = 'Welcome back — you have been re-subscribed to our newsletter.';
    } else {
      $flashMessage = 'You are already subscribed to our newsletter.';
    }

    if ($shouldSendEmail) {
      try {
        Mail::to($email)->queue(new NewsletterSubscriptionConfirmation($email, $token));
      } catch (\Exception $e) {
        logger()->error('Failed to queue newsletter confirmation email', ['email' => $email, 'error' => $e->getMessage()]);
      }
    }

    return back()->with('success', $flashMessage);
  }

  /**
   * Unsubscribe endpoint — user clicks link from email to unsubscribe.
   */
  public function unsubscribe(string $token)
  {
    $subscriber = NewsletterSubscriber::where('unsubscribe_token', $token)->first();

    if (! $subscriber) {
      return redirect()->route('home')->with('error', 'Newsletter subscriber not found or already unsubscribed.');
    }

    $subscriber->update(['unsubscribed_at' => now(), 'unsubscribe_token' => null]);

    return redirect()->route('home')->with('success', 'You have been unsubscribed from the newsletter.');
  }
}
