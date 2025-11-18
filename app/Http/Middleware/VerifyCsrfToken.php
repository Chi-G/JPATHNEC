<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array<int, string>
     */
    protected $except = [
        // Add any routes that should be excluded from CSRF verification
    ];

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, \Closure $next)
    {
        // Ensure session is started before CSRF verification
        if (!$request->session()->isStarted()) {
            $request->session()->start();
        }

        // Regenerate token if it doesn't exist
        if (!$request->session()->has('_token')) {
            $request->session()->regenerateToken();
        }

        return parent::handle($request, $next);
    }
}

