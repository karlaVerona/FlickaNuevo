<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class AdminUserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query();

        if ($request->filled('search')) {
            $query->where('username', 'like', "%{$request->search}%")
                  ->orWhere('email', 'like', "%{$request->search}%");
        }

        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        return response()->json($query->paginate(20));
    }

    public function show(User $user)
    {
        return response()->json($user->load('reviews'));
    }

    public function update(Request $request, User $user)
    {
        $data = $request->validate([
            'username' => 'sometimes|string|max:30',
            'role'     => 'sometimes|in:admin,user',
            'is_pro'   => 'sometimes|boolean',
        ]);

        $user->update($data);

        return response()->json($user);
    }

    public function destroy(User $user)
    {
        $user->delete();

        return response()->json(['message' => 'Usuario eliminado.']);
    }
}