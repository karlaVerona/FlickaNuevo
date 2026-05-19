<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MovieList;
use Illuminate\Http\Request;

class MovieListController extends Controller
{
    // Ver todas mis listas con sus películas
    public function index(Request $request)
    {
        $lists = MovieList::where('user_id', $request->user()->id)
            ->with('movies')
            ->get();

        return response()->json($lists);
    }

    // Crear lista nueva
    public function store(Request $request)
    {
        $request->validate([
            'name'  => 'required|string|max:50',
            'color' => 'nullable|string|max:20',
            'icon'  => 'nullable|string|max:50',
        ]);

        $list = MovieList::create([
            'user_id' => $request->user()->id,
            'name'    => $request->name,
            'color'   => $request->color,
            'icon'    => $request->icon,
        ]);

        return response()->json($list, 201);
    }

    // Editar lista
    public function update(Request $request, $id)
    {
        $list = MovieList::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $request->validate([
            'name'  => 'sometimes|string|max:50',
            'color' => 'nullable|string|max:20',
            'icon'  => 'nullable|string|max:50',
        ]);

        $list->update($request->only(['name', 'color', 'icon']));

        return response()->json($list);
    }

    // Agregar película a lista
    public function addMovie(Request $request, $listId)
    {
        $request->validate([
            'movie_id' => 'required|exists:movies,id',
        ]);

        $list = MovieList::where('id', $listId)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $list->movies()->syncWithoutDetaching([$request->movie_id]);

        return response()->json(['message' => 'Película agregada a la lista']);
    }

    // Eliminar película de lista
    public function removeMovie(Request $request, $listId, $movieId)
    {
        $list = MovieList::where('id', $listId)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $list->movies()->detach($movieId);

        return response()->json(['message' => 'Película eliminada de la lista']);
    }

    // Eliminar lista completa
    public function destroy(Request $request, $id)
    {
        $list = MovieList::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $list->delete();

        return response()->json(['message' => 'Lista eliminada']);
    }
}
