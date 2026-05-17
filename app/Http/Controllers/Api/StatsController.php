<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\Favorite;
use App\Models\Movie;
use Illuminate\Http\Request;

class StatsController extends Controller
{
    public function index(Request $request)
    {
        $userId = $request->user()->id;

        // Total de películas reseñadas
        $totalReviews = Review::where('user_id', $userId)->count();

        // Total de favoritas
        $totalFavorites = Favorite::where('user_id', $userId)->count();

        // Géneros vistos (para la gráfica de pastel)
        $genreStats = Review::where('reviews.user_id', $userId)
            ->join('movies', 'reviews.movie_id', '=', 'movies.id')
            ->selectRaw('movies.genre, COUNT(*) as total')
            ->groupBy('movies.genre')
            ->orderByDesc('total')
            ->get();

        return response()->json([
            'total_reviews'   => $totalReviews,
            'total_favorites' => $totalFavorites,
            'genres'          => $genreStats,
        ]);
    }
}