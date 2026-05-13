<?php

// app/Http/Controllers/Admin/AdminReviewController.php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Services\ActivityLogger;

class AdminReviewController extends Controller
{
    // GET /api/admin/reviews
    public function index()
    {
        return response()->json(
            Review::with('user', 'movie')
                  ->latest()
                  ->paginate(20)
        );
    }

    // DELETE /api/admin/reviews/{review}
    public function destroy(Review $review)
    {
        ActivityLogger::log('deleted_review', 'Review', $review->id);
        $review->delete();

        return response()->json(['message' => 'Reseña eliminada.']);
    }

    // POST /api/admin/reviews/{review}/hide
    public function hide(Review $review)
    {
        $review->update(['status' => 'hidden']);
        ActivityLogger::log('hidden_review', 'Review', $review->id);

        return response()->json(['message' => 'Reseña ocultada.']);
    }
}