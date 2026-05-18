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
            'movie_id'    => 'required|integer',
            'rating'      => 'required|numeric|min:1|max:6',
            'review_text' => 'required|string',
            'mood'        => 'nullable|string',
            'is_six_star' => 'boolean'
        ]);

        $user = $request->user();
        $isSixStar = false;

        // Si quiere dar 6 estrellas
        if ($request->rating == 6 || $request->is_six_star) {

            // Verificar que sea PRO
            if (!$user->is_pro) {
                return response()->json([
                    'message' => 'Solo usuarios PRO pueden dar 6 estrellas'
                ], 403);
            }

            // Verificar que no tenga ya una película con 6 estrellas
            $yaTieneSixStar = Review::where('user_id', $user->id)
                ->where('is_six_star', true)
                ->exists();

            if ($yaTieneSixStar) {
                return response()->json([
                    'message' => 'Ya tienes una película con 6 estrellas. Solo puedes tener una.'
                ], 403);
            }

            $isSixStar = true;
        }

        $review = Review::create([
            'user_id'     => $user->id,
            'movie_id'    => $request->movie_id,
            'rating'      => $request->rating,
            'review_text' => $request->review_text,
            'mood'        => $request->mood,
            'is_six_star' => $isSixStar
        ]);

        return response()->json([
            'message' => 'Review creada correctamente',
            'review'  => $review
        ], 201);
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
            'rating'      => 'required|numeric|min:1|max:6',
            'review_text' => 'required|string',
            'mood'        => 'nullable|string',
            'is_six_star' => 'boolean'
        ]);

        $user = $request->user();
        $isSixStar = $review->is_six_star;

        // Si quiere cambiar a 6 estrellas
        if (($request->rating == 6 || $request->is_six_star) && !$review->is_six_star) {

            // Verificar que sea PRO
            if (!$user->is_pro) {
                return response()->json([
                    'message' => 'Solo usuarios PRO pueden dar 6 estrellas'
                ], 403);
            }

            // Verificar que no tenga ya otra película con 6 estrellas
            $yaTieneSixStar = Review::where('user_id', $user->id)
                ->where('is_six_star', true)
                ->where('id', '!=', $id)
                ->exists();

            if ($yaTieneSixStar) {
                return response()->json([
                    'message' => 'Ya tienes una película con 6 estrellas. Solo puedes tener una.'
                ], 403);
            }

            $isSixStar = true;
        }

        // Si quiere quitar las 6 estrellas
        if ($request->rating < 6 && !$request->is_six_star) {
            $isSixStar = false;
        }

        $review->update([
            'rating'      => $request->rating,
            'review_text' => $request->review_text,
            'mood'        => $request->mood,
            'is_six_star' => $isSixStar
        ]);

        return response()->json([
    'message' => 'Review actualizada',
    'review'  => $review->load('movie')  // ← carga la relación movie
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