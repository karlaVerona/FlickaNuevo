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

    // Guardar géneros favoritos (reemplaza los anteriores)
    public function store(Request $request)
    {
        $request->validate([
            'genres'            => 'required|array|min:1|max:3',
            'genres.*.genre'    => 'required|string|max:50',
            'genres.*.position' => 'required|integer|between:1,3',
        ]);

        $user = $request->user();

        // Borra los géneros anteriores
        UserGenre::where('user_id', $user->id)->delete();

        // Guarda los nuevos
        foreach ($request->genres as $item) {
            UserGenre::create([
                'user_id'  => $user->id,
                'genre'    => $item['genre'],
                'position' => $item['position'],
            ]);
        }

        return response()->json([
            'message' => 'Géneros favoritos actualizados',
            'genres'  => UserGenre::where('user_id', $user->id)->orderBy('position')->get()
        ]);
    }
}