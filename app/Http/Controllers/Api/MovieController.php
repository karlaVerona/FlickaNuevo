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
        if ($request->anio) {
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
}