<?php

use App\Http\Controllers\Settings\AddressController;
use App\Http\Controllers\Settings\AppearanceController;
use App\Http\Controllers\Settings\DeviceController;
use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\TwoFactorAuthenticationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function () {
    Route::redirect('settings', '/settings/profile');

    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Address management routes
    Route::post('settings/addresses', [AddressController::class, 'store'])->name('addresses.store');
    Route::patch('settings/addresses/{address}', [AddressController::class, 'update'])->name('addresses.update');
    Route::delete('settings/addresses/{address}', [AddressController::class, 'destroy'])->name('addresses.destroy');

    Route::get('settings/password', [PasswordController::class, 'edit'])->name('password.edit');

    Route::put('settings/password', [PasswordController::class, 'update'])
        ->middleware('throttle:6,1')
        ->name('password.update');

    Route::get('settings/appearance', [AppearanceController::class, 'edit'])->name('appearance.edit');
    Route::patch('settings/appearance', [AppearanceController::class, 'update'])->name('appearance.update');

    // Device management routes
    Route::get('settings/devices', [DeviceController::class, 'index'])->name('devices.index');
    Route::delete('settings/devices/{device}', [DeviceController::class, 'destroy'])->name('devices.destroy');
    Route::delete('settings/devices', [DeviceController::class, 'destroyOthers'])->name('devices.destroy-others');

    Route::get('settings/two-factor', [TwoFactorAuthenticationController::class, 'show'])
        ->name('two-factor.show');
});
