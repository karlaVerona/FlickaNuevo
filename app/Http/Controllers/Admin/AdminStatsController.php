<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Movie;
use App\Models\Review;

class AdminStatsController extends Controller
{
    public function index()
    {
        return response()->json([
            // Stats existentes
            'total_users'      => User::count(),
            'total_movies'     => Movie::count(),
            'total_reviews'    => Review::count(),
            'six_star_reviews' => Review::where('is_six_star', true)->count(),

            // Stats de planes
            'users_free'       => User::where('is_pro', false)->count(),
            'users_pro'        => User::where('is_pro', true)->count(),

            // Porcentajes
            'pct_free'         => User::count() > 0
                                    ? round(User::where('is_pro', false)->count() / User::count() * 100, 1)
                                    : 0,
            'pct_pro'          => User::count() > 0
                                    ? round(User::where('is_pro', true)->count() / User::count() * 100, 1)
                                    : 0,
        ]);
    }
}