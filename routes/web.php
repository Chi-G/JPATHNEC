<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ShoppingCartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\MyOrdersController;
use App\Http\Controllers\WishlistController;

// Public routes
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::redirect('/home', '/', 301);

// Product routes
Route::get('/product-list', [ProductController::class, 'index'])->name('products.index');
Route::get('/product-list/{filter?}', [ProductController::class, 'index'])->name('product-list');
Route::get('/products/{id}', [ProductController::class, 'show'])->name('products.show');

// Shopping cart routes
Route::get('/shopping-cart', [CartController::class, 'index'])->name('cart');
Route::post('/cart/add', [ShoppingCartController::class, 'store'])->name('cart.store');
Route::put('/cart/{item}', [ShoppingCartController::class, 'update'])->name('cart.update');
Route::delete('/cart/{item}', [ShoppingCartController::class, 'destroy'])->name('cart.destroy');

// Checkout routes
Route::middleware('auth')->group(function () {
    Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
    Route::get('/checkout/success', [CheckoutController::class, 'success'])->name('checkout.success');
});

// My Orders routes
Route::middleware('auth')->group(function () {
    Route::get('/my-orders', [MyOrdersController::class, 'index'])->name('my-orders.index');
    Route::get('/my-orders/{id}', [MyOrdersController::class, 'show'])->name('my-orders.show');
    Route::post('/my-orders/{id}/reorder', [MyOrdersController::class, 'reorder'])->name('my-orders.reorder');
    Route::get('/my-orders/{id}/invoice', [MyOrdersController::class, 'downloadInvoice'])->name('my-orders.invoice');
}); 

// Wishlist routes
Route::middleware('auth')->group(function () {
    Route::get('/wishlist', [WishlistController::class, 'index'])->name('wishlist.index');
    Route::post('/wishlist', [WishlistController::class, 'store'])->name('wishlist.store');
    Route::delete('/wishlist/{productId}', [WishlistController::class, 'destroy'])->name('wishlist.destroy');
    Route::delete('/wishlist/clear', [WishlistController::class, 'clear'])->name('wishlist.clear');
    Route::post('/wishlist/toggle', [WishlistController::class, 'toggle'])->name('wishlist.toggle');
    Route::get('/wishlist/check/{productId}', [WishlistController::class, 'check'])->name('wishlist.check');
});

// Payment routes
Route::middleware('auth')->group(function () {
    Route::post('/payment/initialize', [PaymentController::class, 'initialize'])->name('payment.initialize');
    Route::get('/payment/callback', [PaymentController::class, 'callback'])->name('payment.callback');
    Route::post('/payment/verify', [PaymentController::class, 'verify'])->name('payment.verify');
    
    // Debug/Emergency routes (remove in production)
    Route::post('/payment/clear-cart', [PaymentController::class, 'clearCart'])->name('payment.clear-cart');
    Route::get('/payment/cart-status', [PaymentController::class, 'getCartStatus'])->name('payment.cart-status');
});

// API Routes for cart operations (AJAX)
Route::post('/api/cart/add', [CartController::class, 'add'])->name('api.cart.add')->middleware('auth');
Route::patch('/api/cart/{id}', [CartController::class, 'update'])->name('api.cart.update')->middleware('auth');
Route::delete('/api/cart/{id}', [CartController::class, 'remove'])->name('api.cart.remove')->middleware('auth');
Route::delete('/api/cart', [CartController::class, 'clear'])->name('api.cart.clear')->middleware('auth');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php'; 
