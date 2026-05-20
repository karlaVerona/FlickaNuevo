<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect('/login');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/logout-web', function () {
        auth()->logout();
        request()->session()->invalidate();
        request()->session()->regenerateToken();
        return redirect('/login');
    });
    Route::get('/peliculas',         fn() => Inertia::render('App/Peliculas'))->name('peliculas');
    Route::get('/busqueda',          fn() => Inertia::render('App/Busqueda'))->name('busqueda');
    Route::get('/aleatoria',         fn() => Inertia::render('App/Aleatoria'))->name('aleatoria');
    Route::get('/mis-resenas',       fn() => Inertia::render('App/MisResenas'))->name('mis-resenas');
    Route::get('/mis-listas',        fn() => Inertia::render('App/MisListas'))->name('mis-listas');
    Route::get('/favoritas',         fn() => Inertia::render('App/Favoritas'))->name('favoritas');
    Route::get('/perfil',            fn() => Inertia::render('App/Perfil'))->name('perfil');
    Route::get('/estadisticas',      fn() => Inertia::render('App/Estadisticas'))->name('estadisticas');
    Route::get('/suscripcion',       fn() => Inertia::render('App/Suscripcion'))->name('suscripcion');
    Route::get('/mis-listas',        fn() => Inertia::render('App/MisListas'))->name('mis-listas');
    Route::get('/mis-listas/{id}',   fn($id) => Inertia::render('App/ListaDetalle', ['id' => $id]))->name('lista.detalle');
    Route::get('/profile',    [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile',  [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');


});

Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/admin/dashboard', fn() => Inertia::render('Admin/AdminDashboard'))->name('admin.dashboard');
    Route::get('/admin/peliculas', fn() => Inertia::render('Admin/AdminPeliculas'))->name('admin.peliculas');
    Route::get('/admin/usuarios',  fn() => Inertia::render('Admin/AdminUsuarios'))->name('admin.usuarios');
    Route::get('/admin/resenas',   fn() => Inertia::render('Admin/AdminResenas'))->name('admin.resenas');
    Route::get('/admin/login',     fn() => Inertia::render('Admin/AdminLogin'))->name('admin.login');
});

Route::get('/admin/login', fn() => Inertia::render('Admin/AdminLogin'))->name('admin.login');

require __DIR__ . '/auth.php';
