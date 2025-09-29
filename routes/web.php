<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ShoppingCartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\CartController;

// Public routes
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::redirect('/home', '/', 301); // Redirect /home to / with permanent redirect

// Product routes
Route::get('/product-list', [ProductController::class, 'index'])->name('products.index');
Route::get('/products/{id}', [ProductController::class, 'show'])->name('products.show');

// Shopping cart routes
Route::get('/shopping-cart', [CartController::class, 'index'])->name('cart');
Route::post('/cart/add', [ShoppingCartController::class, 'store'])->name('cart.store');
Route::put('/cart/{item}', [ShoppingCartController::class, 'update'])->name('cart.update');
Route::delete('/cart/{item}', [ShoppingCartController::class, 'destroy'])->name('cart.destroy');

// Checkout routes
Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');
Route::get('/checkout/success', [CheckoutController::class, 'success'])->name('checkout.success');

// API Routes for cart operations (AJAX)
Route::post('/api/cart/add', [CartController::class, 'add'])->name('api.cart.add')->middleware('auth');
Route::patch('/api/cart/{id}', [CartController::class, 'update'])->name('api.cart.update')->middleware('auth');
Route::delete('/api/cart/{id}', [CartController::class, 'remove'])->name('api.cart.remove')->middleware('auth');
Route::delete('/api/cart', [CartController::class, 'clear'])->name('api.cart.clear')->middleware('auth');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
