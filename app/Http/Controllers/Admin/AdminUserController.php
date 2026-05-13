<?php

// app/Http/Controllers/Admin/AdminUserController.php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;

class AdminUserController extends Controller
{
    // GET /api/admin/users
    public function index(Request $request)
    {
        $query = User::query();

        if ($request->filled('search')) {
            $query->where('name', 'like', "%{$request->search}%")
                  ->orWhere('email', 'like', "%{$request->search}%");
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        return response()->json($query->paginate(20));
    }

    // GET /api/admin/users/{user}
    public function show(User $user)
    {
        return response()->json($user->load('reviews'));
    }

    // PUT /api/admin/users/{user}
    public function update(Request $request, User $user)
    {
        $data = $request->validate([
            'name'   => 'sometimes|string|max:255',
            'role'   => 'sometimes|in:admin,moderator,user',
            'status' => 'sometimes|in:active,suspended,pending',
        ]);

        $user->update($data);
        ActivityLogger::log('updated_user', 'User', $user->id, $data);

        return response()->json($user);
    }

    // DELETE /api/admin/users/{user}
    public function destroy(User $user)
    {
        ActivityLogger::log('deleted_user', 'User', $user->id, ['name' => $user->name]);
        $user->delete();

        return response()->json(['message' => 'Usuario eliminado.']);
    }

    // POST /api/admin/users/{user}/suspend
    public function suspend(User $user)
    {
        $user->update(['status' => 'suspended']);
        ActivityLogger::log('suspended_user', 'User', $user->id);

        return response()->json(['message' => 'Usuario suspendido.']);
    }

    // POST /api/admin/users/{user}/activate
    public function activate(User $user)
    {
        $user->update(['status' => 'active']);
        ActivityLogger::log('activated_user', 'User', $user->id);

        return response()->json(['message' => 'Usuario activado.']);
    }
}