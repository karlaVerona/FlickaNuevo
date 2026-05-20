<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Movie;
use Illuminate\Http\Request;

class MovieController extends Controller
{
    public function index(Request $request)
    {
        $query = Movie::query();

        // Búsqueda por título
        if ($request->search) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        // Filtro por género
        if ($request->genre) {
            $query->where('genre', $request->genre);
        }

        // Filtro por año
        if ($request->anio === 'mas_reciente') {
            $query->orderBy('anio', 'desc');
        } elseif ($request->anio === 'mas_antigua') {
            $query->orderBy('anio', 'asc');
        } elseif ($request->anio) {
            $query->where('anio', $request->anio);
        }

        // Filtro por director
        if ($request->director) {
            $query->where('director', 'like', '%' . $request->director . '%');
        }

        // Ordenar por valoración
        if ($request->orden === 'Mayor valoración') {
            $query->orderBy('rating', 'desc');
        } elseif ($request->orden === 'Menor valoración') {
            $query->orderBy('rating', 'asc');
        } else {
            $query->orderBy('title', 'asc');
        }

        return response()->json($query->get());
    }

    // Sugerencia aleatoria
    public function random()
    {
        $movie = Movie::inRandomOrder()->first();
        return response()->json($movie);
    }

    // Catálogo por secciones
    public function sections(Request $request)
    {
        // Últimas 10 agregadas
        $recientes = Movie::orderBy('id', 'desc')->take(15)->get();

        // Mejor valoradas — por promedio de reseñas
        $valoradas = Movie::withAvg('reviews', 'rating')
            ->orderBy('reviews_avg_rating', 'desc')
            ->take(15)
            ->get();

        // Modo familia activado — Animación
        $familia = Movie::where('genre', 'Animación')
            ->inRandomOrder()
            ->take(15)
            ->get();

        // Noche de carcajadas — Comedia
        $comedia = Movie::whereIn('genre', ['Comedia', 'Comedia Romántica'])
            ->inRandomOrder()
            ->take(15)
            ->get();

        // Las de terror 😢 — tag triste
        $terror = Movie::whereJsonContains('tags', 'triste')
            ->inRandomOrder()
            ->take(15)
            ->get();

        // Si te atreves — Terror
        $miedo = Movie::where('genre', 'Terror')
            ->inRandomOrder()
            ->take(15)
            ->get();

                // Fuera de este mundo 
        $scifi = Movie::whereIn('genre', ['Ciencia Ficción', 'Aventura', 'Fantasía'])
            ->inRandomOrder()
            ->take(15)
            ->get();

        // A todo volumen — Musical
        $musical = Movie::whereIn('genre', ['Musical', 'Comedia Musical'])
            ->inRandomOrder()
            ->take(15)
            ->get();

        // Drama
        $drama = Movie::whereIn('genre', ['Drama'])
            ->inRandomOrder()
            ->take(15)
            ->get();

        // Acción
        $accion = Movie::whereIn('genre', ['Acción', 'Aventura'])
            ->inRandomOrder()
            ->take(15)
            ->get();

        // Mariposas en el estómago — tag romantica
        $romantica = Movie::whereJsonContains('tags', 'romantica')
            ->inRandomOrder()
            ->take(15)
            ->get();
        
        return response()->json([
            'recientes' => $recientes,
            'valoradas' => $valoradas,
            'familia'   => $familia,
            'comedia'   => $comedia,
            'terror'    => $terror,
            'miedo'     => $miedo,
            'scifi'     => $scifi,
            'musical'   => $musical,
            'romantica' => $romantica,
            'drama'     => $drama,
            'accion'     => $accion,
        ]);
    }

    public function genres()
    {
        $genres = Movie::select('genre')
            ->distinct()
            ->whereNotNull('genre')
            ->orderBy('genre')
            ->pluck('genre');

        return response()->json($genres);
    }
}