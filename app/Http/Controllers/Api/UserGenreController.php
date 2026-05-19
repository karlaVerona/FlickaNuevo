<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UserGenre;
use Illuminate\Http\Request;

class UserGenreController extends Controller
{
    // Ver mis géneros favoritos
    public function index(Request $request)
    {
        $genres = UserGenre::where('user_id', $request->user()->id)
            ->orderBy('position')
            ->get();

        return response()->json($genres);
    }

    public function store(Request $request)
{
    $user = $request->user();

    $lastChange = $user->genre_updated_at; // ← snake_case, no camelCase

    if ($lastChange && \Carbon\Carbon::parse($lastChange)->isCurrentMonth()) {
        return response()->json([
            'message' => 'Solo puedes cambiar tus géneros favoritos una vez al mes.'
        ], 429);
    }

    $request->validate([
        'genres'          => 'required|array|min:1|max:3',
        'genres.*.genre'  => 'required|string|max:50',
        'genres.*.position' => 'required|integer|min:1|max:3',
    ]);

    // Borra los anteriores e inserta los nuevos
    UserGenre::where('user_id', $user->id)->delete();

    foreach ($request->genres as $g) {
        UserGenre::create([
            'user_id'  => $user->id,
            'genre'    => $g['genre'],
            'position' => $g['position'],
        ]);
    }

    $user->update(['genre_updated_at' => now()]);

    return response()->json(['message' => 'Géneros actualizados correctamente.']);
}
}
