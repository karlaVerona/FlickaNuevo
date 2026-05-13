<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'movie_id' => 'required|integer',
            'rating' => 'required|numeric|min:1|max:5',
            'review_text' => 'required|string',
            'mood' => 'nullable|string'
        ]);

        $review = Review::create([
            'user_id' => $request->user()->id,
            'movie_id' => $request->movie_id,
            'rating' => $request->rating,
            'review_text' => $request->review_text,
            'mood' => $request->mood,
            'is_six_star' => false
        ]);

        return response()->json([
            'message' => 'Review creada correctamente',
            'review' => $review
        ]);
    }

    public function myReviews(Request $request)
    {
        $reviews = Review::with(['movie', 'user'])
    ->where('user_id', $request->user()->id)
    ->get();

        return response()->json([
            'reviews' => $reviews
        ]);
    }

    public function update(Request $request, $id)
    {
        $review = Review::find($id);

        if (!$review) {
            return response()->json([
                'message' => 'Review no encontrada'
            ], 404);
        }

        if ($review->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'No autorizado'
            ], 403);
        }

        $request->validate([
            'rating' => 'required|numeric|min:1|max:5',
            'review_text' => 'required|string',
            'mood' => 'nullable|string'
        ]);

        $review->update([
            'rating' => $request->rating,
            'review_text' => $request->review_text,
            'mood' => $request->mood
        ]);

        return response()->json([
            'message' => 'Review actualizada',
            'review' => $review
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $review = Review::find($id);

        if (!$review) {
            return response()->json([
                'message' => 'Review no encontrada'
            ], 404);
        }

        if ($review->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'No autorizado'
            ], 403);
        }

        $review->delete();

        return response()->json([
            'message' => 'Review eliminada correctamente'
        ]);
    }
}