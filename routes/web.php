<?php

use App\Http\Controllers\Account;
use App\Http\Controllers\Admin;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Storefront;
use Illuminate\Support\Facades\Route;

Route::get('/', Storefront\HomeController::class)->name('home');
Route::get('/products', [Storefront\ProductController::class, 'index'])->name('products.index');
Route::get('/season-offers', [Storefront\ProductController::class, 'offers'])->name('offers.index');
Route::get('/products/{product:slug}', [Storefront\ProductController::class, 'show'])->name('products.show');
Route::get('/categories/{category:slug}', [Storefront\CategoryController::class, 'show'])->name('categories.show');
Route::get('/cart', [Storefront\CartController::class, 'index'])->name('cart.index');
Route::post('/cart', [Storefront\CartController::class, 'store'])->name('cart.store');
Route::patch('/cart/items/{item}', [Storefront\CartController::class, 'update'])->name('cart.items.update');
Route::delete('/cart/items/{item}', [Storefront\CartController::class, 'destroy'])->name('cart.items.destroy');
Route::get('/checkout', [Storefront\CheckoutController::class, 'create'])->name('checkout.create');
Route::post('/checkout', [Storefront\CheckoutController::class, 'store'])->middleware('throttle:6,1')->name('checkout.store');
Route::get('/thank-you/{order:order_number}', [Storefront\CheckoutController::class, 'thankYou'])->name('checkout.thank-you');
Route::post('/reviews', [Storefront\ReviewController::class, 'store'])->name('reviews.store');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', Account\DashboardController::class)->name('dashboard');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::prefix('account')->name('account.')->group(function () {
        Route::get('/dashboard', Account\DashboardController::class)->name('dashboard');
        Route::get('/orders', [Account\OrderController::class, 'index'])->name('orders.index');
        Route::get('/orders/{order}', [Account\OrderController::class, 'show'])->name('orders.show');
        Route::patch('/orders/{order}/cancel', [Account\OrderController::class, 'cancel'])->name('orders.cancel');
    });
});

Route::middleware(['auth', 'verified', 'role:super_admin,admin,manager,staff'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', Admin\DashboardController::class)->name('dashboard');
    Route::patch('products/{product}/status', [Admin\ProductController::class, 'updateStatus'])->name('products.status');
    Route::patch('products/{product}/stock', [Admin\ProductController::class, 'updateStock'])->name('products.stock');
    Route::patch('products/{product}/offer', [Admin\ProductController::class, 'updateOffer'])->name('products.offer');
    Route::patch('categories/{category}/status', [Admin\CategoryController::class, 'updateStatus'])->name('categories.status');
    Route::resource('products', Admin\ProductController::class);
    Route::resource('categories', Admin\CategoryController::class);
    Route::resource('brands', Admin\BrandController::class);
    Route::resource('coupons', Admin\CouponController::class);
    Route::resource('banners', Admin\BannerController::class);
    Route::resource('reviews', Admin\ReviewController::class)->only(['index', 'update', 'destroy']);
    Route::get('orders', [Admin\OrderController::class, 'index'])->name('orders.index');
    Route::get('orders/{order}', [Admin\OrderController::class, 'show'])->name('orders.show');
    Route::patch('orders/{order}/status', [Admin\OrderController::class, 'updateStatus'])->name('orders.status');
    Route::get('customers', Admin\CustomerController::class)->name('customers.index');
    Route::get('inventory', [Admin\InventoryController::class, 'index'])->name('inventory.index');
    Route::post('inventory', [Admin\InventoryController::class, 'store'])->name('inventory.store');
    Route::get('reports', Admin\ReportController::class)->name('reports.index');
    Route::get('settings', Admin\SettingController::class)->name('settings.index');
    Route::patch('settings', [Admin\SettingController::class, 'update'])->name('settings.update');
});

require __DIR__.'/auth.php';
