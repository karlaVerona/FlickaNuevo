<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;

class AdminReviewController extends Controller
{
    public function index()
    {
        return response()->json(
            Review::with('user', 'movie')
                  ->latest()
                  ->paginate(20)
        );
    }

    public function destroy(Review $review)
    {
        $review->delete();

        return response()->json(['message' => 'Reseña eliminada.']);
    }
}