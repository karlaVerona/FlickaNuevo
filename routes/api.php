<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\FavoriteController;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('auth:sanctum')->post('/reviews', [ReviewController::class, 'store']);

Route::middleware('auth:sanctum')->get('/my-reviews', [ReviewController::class, 'myReviews']);

Route::middleware('auth:sanctum')->put('/reviews/{id}', [ReviewController::class, 'update']);

Route::middleware('auth:sanctum')->delete('/reviews/{id}', [ReviewController::class, 'destroy']);

Route::middleware('auth:sanctum')->post('/favorites', [FavoriteController::class, 'store']);

Route::middleware('auth:sanctum')->get('/favorites', [FavoriteController::class, 'index']);

Route::middleware('auth:sanctum')->delete('/favorites/{id}', [FavoriteController::class, 'destroy']);

Route::post('/register', [RegisteredUserController::class, 'store']);

Route::post('/login', [AuthenticatedSessionController::class, 'store']);
