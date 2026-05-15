<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Auth\RegisteredUserController;
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

// ── RUTAS DE FLICKA (requieren sesión iniciada) ──
Route::middleware(['auth'])->group(function () {

    // Esta es la ruta principal — reemplaza al dashboard
    Route::get('/peliculas', fn() => Inertia::render('App/Peliculas'))->name('peliculas');

    Route::get('/busqueda',      fn() => Inertia::render('App/Busqueda'))->name('busqueda');
    Route::get('/aleatoria',     fn() => Inertia::render('App/Aleatoria'))->name('aleatoria');
    Route::get('/mis-resenas',   fn() => Inertia::render('App/MisResenas'))->name('mis-resenas');
    Route::get('/mis-listas',    fn() => Inertia::render('App/MisListas'))->name('mis-listas');
    Route::get('/favoritas',     fn() => Inertia::render('App/Favoritas'))->name('favoritas');
    Route::get('/perfil',        fn() => Inertia::render('App/Perfil'))->name('perfil');
    Route::get('/estadisticas',  fn() => Inertia::render('App/Estadisticas'))->name('estadisticas');
    Route::get('/suscripcion',   fn() => Inertia::render('App/Suscripcion'))->name('suscripcion');

    // Rutas de perfil que generó Breeze (editar cuenta, cambiar contraseña, etc.)
    Route::get('/profile',    [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile',  [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';