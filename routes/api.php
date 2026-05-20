<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Auth
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Api\ApiAuthController;

// API
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\FavoriteController;
use App\Http\Controllers\Api\MovieListController;
use App\Http\Controllers\Api\MovieController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\UserGenreController;
use App\Http\Controllers\Api\StatsController;
use App\Http\Controllers\Api\SubscriptionController;


// Admin
use App\Http\Controllers\Admin\AdminStatsController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Admin\AdminMovieController;
use App\Http\Controllers\Admin\AdminReviewController;

// ─────────────────────────────────────────────
// PÚBLICAS
// ─────────────────────────────────────────────
Route::post('/register', [RegisteredUserController::class, 'store']);
Route::post('/login',    [ApiAuthController::class, 'login']);

// ─────────────────────────────────────────────
// USUARIO AUTENTICADO
// ─────────────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/user', fn(Request $request) => $request->user());
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy']);

    // Perfil
    Route::get('/profile',          [ProfileController::class, 'show']);
    Route::put('/profile',          [ProfileController::class, 'update']);
    Route::put('/profile/password', [ProfileController::class, 'updatePassword']);
    Route::post('/profile/photo',   [ProfileController::class, 'updatePhoto']);
    Route::post('/profile/banner',  [ProfileController::class, 'updateBanner']);  
    Route::put('/profile/color',    [ProfileController::class, 'updateColor']);   
    Route::get('/mi-club', [UserGenreController::class, 'miClub']);

    // Géneros favoritos
    Route::get('/profile/genres',  [UserGenreController::class, 'index']);
    Route::post('/profile/genres', [UserGenreController::class, 'store']);
    

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
    Route::put('/lists/{id}',                          [MovieListController::class, 'update']);

    // Películas
    Route::get('/movies/sections', [MovieController::class, 'sections']);
    Route::get('/movies/random',   [MovieController::class, 'random']);
    Route::get('/movies',          [MovieController::class, 'index']);
    Route::get('/movies/genres', [MovieController::class, 'genres']);

    // Suscripción
    Route::get('/subscription',    [SubscriptionController::class, 'index']);
    Route::post('/subscription',   [SubscriptionController::class, 'store']);
    Route::delete('/subscription', [SubscriptionController::class, 'destroy']);
    // Estadísticas
    Route::get('/stats', [StatsController::class, 'index']);
});

// ─────────────────────────────────────────────
// ADMIN
// ─────────────────────────────────────────────
    Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {

    Route::get('/stats', [AdminStatsController::class, 'index']);

    Route::get('/users',                  [AdminUserController::class, 'index']);
    Route::get('/users/{user}',           [AdminUserController::class, 'show']);
    Route::put('/users/{user}',           [AdminUserController::class, 'update']);
    Route::delete('/users/{user}',        [AdminUserController::class, 'destroy']);

    Route::apiResource('/movies', AdminMovieController::class);

    Route::get('/reviews',                [AdminReviewController::class, 'index']);
    Route::delete('/reviews/{review}',    [AdminReviewController::class, 'destroy']);
});
