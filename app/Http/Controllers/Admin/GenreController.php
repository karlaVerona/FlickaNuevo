<?php

// app/Http/Controllers/Admin/GenreController.php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Genre;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;

class GenreController extends Controller
{
    // GET /api/genres  (público — para formularios del front)
    // GET /api/admin/genres (admin)
    public function index()
    {
        return response()->json(
            Genre::withCount('movies')->orderBy('name')->get()
        );
    }

    // POST /api/admin/genres
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:100|unique:genres,name',
        ]);

        $genre = Genre::create($data);
        ActivityLogger::log('created_genre', 'Genre', $genre->id, $data);

        return response()->json($genre, 201);
    }

    // PUT /api/admin/genres/{genre}
    public function update(Request $request, Genre $genre)
    {
        $data = $request->validate([
            'name' => "required|string|max:100|unique:genres,name,{$genre->id}",
        ]);

        $genre->update($data);
        ActivityLogger::log('updated_genre', 'Genre', $genre->id, $data);

        return response()->json($genre);
    }

    // DELETE /api/admin/genres/{genre}
    public function destroy(Genre $genre)
    {
        ActivityLogger::log('deleted_genre', 'Genre', $genre->id, ['name' => $genre->name]);
        $genre->delete();

        return response()->json(['message' => 'Género eliminado.']);
    }
}