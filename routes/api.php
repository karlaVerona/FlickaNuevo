<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Auth
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Api\ApiAuthController;

// API existente
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\FavoriteController;
use App\Http\Controllers\Api\MovieListController;

// Admin
use App\Http\Controllers\Admin\AdminStatsController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Admin\AdminMovieController;
use App\Http\Controllers\Admin\AdminReviewController;

// ── PÚBLICAS ──────────────────────────────────────
Route::post('/register', [RegisteredUserController::class, 'store']);
Route::post('/login',    [AuthenticatedSessionController::class, 'store']);
//Route::post('/login',    [ApiAuthController::class, 'login']); 

// ── USUARIO AUTENTICADO ───────────────────────────
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/user', fn(Request $request) => $request->user());
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy']);
    //Route::post('/logout', [ApiAuthController::class, 'logout']);

    // Reseñas
    Route::post('/reviews',        [ReviewController::class, 'store']);
    Route::get('/my-reviews',      [ReviewController::class, 'myReviews']);
    Route::put('/reviews/{id}',    [ReviewController::class, 'update']);
    Route::delete('/reviews/{id}', [ReviewController::class, 'destroy']);

    // Favoritos
    Route::post('/favorites',        [FavoriteController::class, 'store']);
    Route::get('/favorites',         [FavoriteController::class, 'index']);
    Route::delete('/favorites/{id}', [FavoriteController::class, 'destroy']);

    // Listas
    Route::get('/lists',                               [MovieListController::class, 'index']);
    Route::post('/lists',                              [MovieListController::class, 'store']);
    Route::delete('/lists/{id}',                       [MovieListController::class, 'destroy']);
    Route::post('/lists/{listId}/movies',              [MovieListController::class, 'addMovie']);
    Route::delete('/lists/{listId}/movies/{movieId}',  [MovieListController::class, 'removeMovie']);
});

// ── ADMIN ─────────────────────────────────────────
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {

    // Dashboard
    Route::get('/stats', [AdminStatsController::class, 'index']);

    // Usuarios
    Route::get('/users',           [AdminUserController::class, 'index']);
    Route::get('/users/{user}',    [AdminUserController::class, 'show']);
    Route::put('/users/{user}',    [AdminUserController::class, 'update']);
    Route::delete('/users/{user}', [AdminUserController::class, 'destroy']);

    // Películas
    Route::apiResource('/movies', AdminMovieController::class);

    // Reseñas (moderación)
    Route::get('/reviews',             [AdminReviewController::class, 'index']);
    Route::delete('/reviews/{review}', [AdminReviewController::class, 'destroy']);
});