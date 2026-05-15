<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';



Route::get('/login', function () {
    return Inertia::render('Auth/Login');
})->name('login');
Route::get('/peliculas', function () {
    return Inertia::render('App/Peliculas');
});

Route::get('/busqueda', function () {
    return Inertia::render('App/Busqueda');
});

Route::get('/aleatoria', function () {
    return Inertia::render('App/Aleatoria');
});Route::get('/register', function () {
    return Inertia::render('Auth/Register');
})->name('register');