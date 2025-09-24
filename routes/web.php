<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ShoppingCartController;
use App\Http\Controllers\CheckoutController;

// Public routes
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::redirect('/home', '/', 301); // Redirect /home to / with permanent redirect

// Product routes
Route::get('/product-list', [ProductController::class, 'index'])->name('products.index');
Route::get('/product-detail', [ProductController::class, 'show'])->name('products.show');
Route::get('/product-detail/{id}', [ProductController::class, 'show'])->name('products.detail');

// Shopping cart routes
Route::get('/shopping-cart', [ShoppingCartController::class, 'index'])->name('cart.index');
Route::post('/cart/add', [ShoppingCartController::class, 'store'])->name('cart.store');
Route::put('/cart/{item}', [ShoppingCartController::class, 'update'])->name('cart.update');
Route::delete('/cart/{item}', [ShoppingCartController::class, 'destroy'])->name('cart.destroy');

// Checkout routes
Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');
Route::get('/checkout/success', [CheckoutController::class, 'success'])->name('checkout.success');

// API routes for cart operations (for AJAX calls)
Route::prefix('api')->group(function () {
    Route::post('/cart/add', [ShoppingCartController::class, 'store'])->name('api.cart.add');
    Route::put('/cart/{item}', [ShoppingCartController::class, 'update'])->name('api.cart.update');
    Route::delete('/cart/{item}', [ShoppingCartController::class, 'destroy'])->name('api.cart.remove');
});

// Authenticated routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
