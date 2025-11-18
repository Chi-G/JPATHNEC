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

        $isLoginPage = $request->routeIs('filament.admin.auth.login') ||
                       $request->is('admin/login');

        if ($isLoginPage) {
            return $next($request);
        }

        if (! $user || ! in_array($user->email, $allowedEmails, true)) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'You are not authorized to access this area.'], 403);
            }

            return redirect()->route('home')
                ->with('error', 'You are not authorized to access the admin panel. Only specific admin accounts are allowed.');
        }

        return $next($request);
    }
}

