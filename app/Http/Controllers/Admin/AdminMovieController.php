<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Movie;
use Illuminate\Http\Request;

class AdminMovieController extends Controller
{
    public function index(Request $request)
    {
        $query = Movie::query();

        if ($request->filled('search')) {
            $query->where('title', 'like', "%{$request->search}%");
        }

        if ($request->get('sort') === 'best_rated') {
            $query->orderByDesc('rating');
        } elseif ($request->get('sort') === 'most_viewed') {
            $query->latest();
        } else {
            $query->latest();
        }

        return response()->json($query->paginate(20));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title'    => 'required|string|max:100',
            'director' => 'required|string|max:50',
            'anio'     => 'nullable|digits:4|integer',
            'genre'    => 'nullable|string|max:50',
            'synopsis' => 'nullable|string',
            'poster'   => 'nullable|string|max:255',
        ]);

        $movie = Movie::create($data);

        return response()->json($movie, 201);
    }

    public function show(Movie $movie)
    {
        return response()->json($movie->load('reviews'));
    }

    public function update(Request $request, Movie $movie)
    {
        $data = $request->validate([
            'title'    => 'sometimes|string|max:100',
            'director' => 'sometimes|string|max:50',
            'anio'     => 'nullable|digits:4|integer',
            'genre'    => 'nullable|string|max:50',
            'synopsis' => 'nullable|string',
            'poster'   => 'nullable|string|max:255',
        ]);

        $movie->update($data);

        return response()->json($movie);
    }

    public function destroy(Movie $movie)
    {
        $movie->delete();

        return response()->json(['message' => 'Película eliminada.']);
    }
}