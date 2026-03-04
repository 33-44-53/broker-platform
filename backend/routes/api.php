<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\AuctionController;
use App\Http\Controllers\Api\AnalyticsController;

Route::middleware('api')->group(function () {
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::get('/auth/artisans', [AuthController::class, 'getArtisans']);
    Route::get('/auth/buyers', [AuthController::class, 'getBuyers']);
    Route::post('/auth/toggle-status', [AuthController::class, 'toggleStatus']);

    Route::get('/products', [ProductController::class, 'index']);
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{id}', [ProductController::class, 'update']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);

    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders', [OrderController::class, 'index']);

    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);

    Route::post('/auctions', [AuctionController::class, 'store']);
    Route::get('/auctions', [AuctionController::class, 'index']);
    Route::post('/auctions/approve', [AuctionController::class, 'approve']);
    Route::post('/auctions/reject', [AuctionController::class, 'reject']);

    Route::get('/analytics', [AnalyticsController::class, 'index']);
});
