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
use App\Http\Controllers\Api\MovieController; 

// Admin
use App\Http\Controllers\Admin\AdminStatsController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Admin\AdminMovieController;
use App\Http\Controllers\Admin\AdminReviewController;

// ── PÚBLICAS ──────────────────────────────────────
// Registro de nuevo usuario → devuelve token
Route::post('/register', [RegisteredUserController::class, 'store']);
// Login → devuelve token
Route::post('/login',    [AuthenticatedSessionController::class, 'store']);

// ── USUARIO AUTENTICADO ───────────────────────────
// Todo lo de aquí requiere Bearer token en el header
Route::middleware('auth:sanctum')->group(function () {

    // Devuelve los datos del usuario autenticado
    Route::get('/user', fn(Request $request) => $request->user());
    // Cierra sesión borrando el token
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy']);

    // ── Reseñas ──
    // Crear una reseña de una película
    Route::post('/reviews',        [ReviewController::class, 'store']);
    // Ver todas mis reseñas
    Route::get('/my-reviews',      [ReviewController::class, 'myReviews']);
    // Editar una reseña mía
    Route::put('/reviews/{id}',    [ReviewController::class, 'update']);
    // Eliminar una reseña mía
    Route::delete('/reviews/{id}', [ReviewController::class, 'destroy']);

    // ── Favoritos ──
    // Agregar película a favoritas
    Route::post('/favorites',        [FavoriteController::class, 'store']);
    // Ver todas mis favoritas
    Route::get('/favorites',         [FavoriteController::class, 'index']);
    // Eliminar una favorita
    Route::delete('/favorites/{id}', [FavoriteController::class, 'destroy']);

    // ── Listas ──
    // Ver todas mis listas con sus películas
    Route::get('/lists',                               [MovieListController::class, 'index']);
    // Crear una lista nueva
    Route::post('/lists',                              [MovieListController::class, 'store']);
    // Eliminar una lista completa
    Route::delete('/lists/{id}',                       [MovieListController::class, 'destroy']);
    // Agregar película a una lista
    Route::post('/lists/{listId}/movies',              [MovieListController::class, 'addMovie']);
    // Eliminar película de una lista
    Route::delete('/lists/{listId}/movies/{movieId}',  [MovieListController::class, 'removeMovie']);

    // ── Películas ──
    // Ver catálogo completo con filtros (search, genre, anio, director, orden)
    Route::get('/movies',        [MovieController::class, 'index']);
    // Obtener una película aleatoria
    Route::get('/movies/random', [MovieController::class, 'random']);
});

// ── ADMIN ─────────────────────────────────────────
// Todo lo de aquí requiere token + rol admin
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {

    // Estadísticas del dashboard admin
    Route::get('/stats', [AdminStatsController::class, 'index']);

    // Gestión de usuarios
    Route::get('/users',           [AdminUserController::class, 'index']);
    Route::get('/users/{user}',    [AdminUserController::class, 'show']);
    Route::put('/users/{user}',    [AdminUserController::class, 'update']);
    Route::delete('/users/{user}', [AdminUserController::class, 'destroy']);

    // CRUD completo de películas (solo admin puede crear/editar/eliminar)
    Route::apiResource('/movies', AdminMovieController::class);

    // Moderación de reseñas
    Route::get('/reviews',             [AdminReviewController::class, 'index']);
    Route::delete('/reviews/{review}', [AdminReviewController::class, 'destroy']);
});