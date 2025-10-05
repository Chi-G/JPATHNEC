<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;

class FortifyVerifyEmailController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified.
     */
    public function __invoke(EmailVerificationRequest $request): RedirectResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return redirect()->intended(route('home', absolute: false).'?verified=1')
                ->with('message', 'Your email was already verified.');
        }

        $request->fulfill();

        return redirect()->intended(route('home', absolute: false).'?verified=1')
            ->with('message', 'Email verified successfully! Welcome to JPATHNEC.');
    }
}
