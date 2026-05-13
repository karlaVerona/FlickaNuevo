<?php

// app/Http/Controllers/Admin/AdminMovieController.php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Movie;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;

class AdminMovieController extends Controller
{
    // GET /api/admin/movies
    public function index(Request $request)
    {
        $query = Movie::with('genre');

        if ($request->filled('search')) {
            $query->where('title', 'like', "%{$request->search}%");
        }

        if ($request->get('sort') === 'best_rated') {
            $query->orderByDesc('rating');
        } elseif ($request->get('sort') === 'most_viewed') {
            $query->orderByDesc('views');
        } else {
            $query->latest();
        }

        return response()->json($query->paginate(20));
    }

    // POST /api/admin/movies
    public function store(Request $request)
    {
        $data = $request->validate([
            'title'    => 'required|string|max:255',
            'director' => 'nullable|string|max:255',
            'year'     => 'nullable|integer|min:1888|max:2099',
            'genre_id' => 'nullable|exists:genres,id',
            'synopsis' => 'nullable|string',
            'poster'   => 'nullable|url',
        ]);

        $movie = Movie::create($data);
        ActivityLogger::log('created_movie', 'Movie', $movie->id, ['title' => $movie->title]);

        return response()->json($movie, 201);
    }

    // GET /api/admin/movies/{movie}
    public function show(Movie $movie)
    {
        return response()->json($movie->load('genre', 'reviews.user'));
    }

    // PUT /api/admin/movies/{movie}
    public function update(Request $request, Movie $movie)
    {
        $data = $request->validate([
            'title'    => 'sometimes|string|max:255',
            'director' => 'nullable|string|max:255',
            'year'     => 'nullable|integer|min:1888|max:2099',
            'genre_id' => 'nullable|exists:genres,id',
            'synopsis' => 'nullable|string',
            'poster'   => 'nullable|url',
        ]);

        $movie->update($data);
        ActivityLogger::log('updated_movie', 'Movie', $movie->id, $data);

        return response()->json($movie);
    }

    // DELETE /api/admin/movies/{movie}
    public function destroy(Movie $movie)
    {
        ActivityLogger::log('deleted_movie', 'Movie', $movie->id, ['title' => $movie->title]);
        $movie->delete();

        return response()->json(['message' => 'Película eliminada.']);
    }
}