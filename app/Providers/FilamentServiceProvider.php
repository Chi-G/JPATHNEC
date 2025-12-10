<?php

namespace App\Providers;

use Filament\Facades\Filament;
use Illuminate\Support\ServiceProvider;

class FilamentServiceProvider extends ServiceProvider
{
    public function boot()
    {
        // Fix for shared hosting cookie issues
        config(['session.same_site' => 'lax']); 
    }
}