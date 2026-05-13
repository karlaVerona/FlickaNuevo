<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\{User, Movie, Review, Report};

class AdminStatsController extends Controller
{
    public function index()
    {
        return response()->json([
            'total_users'       => User::count(),
            'total_movies'      => Movie::count(),
            'published_reviews' => Review::count(),   // tu tabla no tiene 'status'
            'pending_reports'   => Report::where('status', 'pending')->count(),
        ]);
    }
}