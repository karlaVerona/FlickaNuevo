<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class ProfileController extends Controller
{
    // Ver perfil
    public function show(Request $request)
    {
        return response()->json($request->user());
    }

    // Editar perfil
    public function update(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'username' => ['sometimes', 'string', 'max:30', Rule::unique('users')->ignore($user->id)],
            'email'    => ['sometimes', 'email', 'max:150', Rule::unique('users')->ignore($user->id)],
            'bio'      => ['nullable', 'string', 'max:500'],
        ]);

        $user->update($request->only(['username', 'email', 'bio']));

        return response()->json([
            'message' => 'Perfil actualizado',
            'user'    => $user
        ]);
    }

    // Cambiar contraseña
    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|string',
            'password'         => 'required|string|min:8|confirmed',
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'message' => 'La contraseña actual es incorrecta'
            ], 403);
        }

        $user->update([
            'password' => Hash::make($request->password)
        ]);

        return response()->json([
            'message' => 'Contraseña actualizada correctamente'
        ]);
    }

    // Subir foto de perfil
    public function updatePhoto(Request $request)
    {
        $request->validate([
            'photo' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048'
        ]);

        $user = $request->user();

        $path = $request->file('photo')->store('profile-photos', 'public');

        $user->update([
            'photo' => '/storage/' . $path
        ]);

        return response()->json([
            'message' => 'Foto actualizada',
            'photo'   => $user->photo
        ]);
    }

    public function updateBanner(Request $request)
{
    $request->validate([
        'banner' => 'required|image|mimes:jpg,jpeg,png,webp|max:4096'
    ]);

    $user = $request->user();
    $path = $request->file('banner')->store('banners', 'public');

    $user->update([
        'banner' => '/storage/' . $path
    ]);

    return response()->json([
        'message' => 'Banner actualizado',
        'banner'  => $user->banner
    ]);
}

public function updateColor(Request $request)
{
    $request->validate([
        'color' => 'required|string|regex:/^#[0-9A-Fa-f]{6}$/'
    ]);

    $request->user()->update(['color' => $request->color]);

    return response()->json([
        'message' => 'Color actualizado',
        'color'   => $request->user()->color
    ]);
}
}