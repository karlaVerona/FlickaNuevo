<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Favorite;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'movie_id' => 'required|integer'
        ]);

        $favorite = Favorite::create([
            'user_id' => $request->user()->id,
            'movie_id' => $request->movie_id
        ]);

        return response()->json([
            'message' => 'Película agregada a favoritas',
            'favorite' => $favorite
        ]);
    }

    public function index(Request $request)
    {
        $favorites = Favorite::with('movie')
            ->where('user_id', $request->user()->id)
            ->get();

        return response()->json([
            'favorites' => $favorites
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $favorite = Favorite::find($id);

        if (!$favorite) {
            return response()->json([
                'message' => 'Favorita no encontrada'
            ], 404);
        }

        if ($favorite->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'No autorizado'
            ], 403);
        }

        $favorite->delete();

        return response()->json([
            'message' => 'Favorita eliminada correctamente'
        ]);
    }
}