<?php

namespace App\Http\Middleware;

use Closure;
use Filament\Facades\Filament;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsFilamentAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = Filament::auth()->user();
        $allowedEmails = config('filament-admin.allowed_emails', []);

        if (! $user || ! in_array($user->email, $allowedEmails, true)) {
            Filament::auth()->logout();

            abort(403, 'You are not authorized to access this area.');
        }

        return $next($request);
    }
}

