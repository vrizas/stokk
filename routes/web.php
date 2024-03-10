<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductTypeController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TransactionController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', [DashboardController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'verified'])->prefix('products')->group(function () {
    Route::get('/', [ProductController::class, 'index'])->name('product.index');
});

Route::middleware(['auth', 'verified'])->prefix('product-types')->group(function () {
    Route::get('/', [ProductTypeController::class, 'index'])->name('product-type.index');
});

Route::middleware(['auth', 'verified'])->prefix('transactions')->group(function () {
    Route::get('/', [TransactionController::class, 'index'])->name('transaction.index');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware('auth')->prefix('api/v1')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'getData'])->name('dashboard.getData');
    Route::get('/dashboard/compare-product-types', [DashboardController::class, 'compareProductTypes'])->name('dashboard.compareProductTypes');

    Route::get('/product-types', [ProductTypeController::class, 'getData'])->name('product-type.getData');
    Route::get('/product-types/{id}', [ProductTypeController::class, 'show'])->name('product-type.show');
    Route::post('/product-types', [ProductTypeController::class, 'store'])->name('product-type.store');
    Route::put('/product-types/{id}', [ProductTypeController::class, 'update'])->name('product-type.update');
    Route::delete('/product-types/{id}', [ProductTypeController::class, 'destroy'])->name('product-type.destroy');

    Route::get('/products', [ProductController::class, 'getData'])->name('product.getData');
    Route::get('/products/{id}', [ProductController::class, 'show'])->name('product.show');
    Route::post('/products', [ProductController::class, 'store'])->name('product.store');
    Route::put('/products/{id}', [ProductController::class, 'update'])->name('product.update');
    Route::delete('/products/{id}', [ProductController::class, 'destroy'])->name('product.destroy');

    Route::get('/transactions', [TransactionController::class, 'getData'])->name('transaction.getData');
    Route::get('/transactions/{id}', [TransactionController::class, 'show'])->name('transaction.show');
    Route::post('/transactions', [TransactionController::class, 'store'])->name('transaction.store');
    Route::put('/transactions/{id}', [TransactionController::class, 'update'])->name('transaction.update');
    Route::delete('/transactions/{id}', [TransactionController::class, 'destroy'])->name('transaction.destroy');
});

require __DIR__.'/auth.php';
