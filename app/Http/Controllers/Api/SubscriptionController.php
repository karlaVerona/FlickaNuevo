<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use App\Mail\SuscripcionConfirmada;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class SubscriptionController extends Controller
{
    // Obtener suscripción activa
    public function index(Request $request)
    {
        $subscription = Subscription::where('user_id', $request->user()->id)
            ->where('status', 'activo')
            ->latest()
            ->first();

        return response()->json([
            'is_pro'       => $request->user()->is_pro,
            'subscription' => $subscription,
        ]);
    }

    // Suscribirse a PRO
    public function store(Request $request)
    {
        $request->validate([
            'plan' => 'required|in:mensual,anual',
        ]);

        $user = $request->user();

        if ($user->is_pro) {
            return response()->json([
                'message' => 'Ya tienes una suscripción PRO activa'
            ], 400);
        }

        // Calcular fecha de fin
        $endDate = $request->plan === 'mensual'
            ? now()->addMonth()
            : now()->addYear();

        // Cancelar suscripciones anteriores
        Subscription::where('user_id', $user->id)
            ->where('status', 'activo')
            ->update(['status' => 'inactivo']);

        // Crear nueva suscripción
        Subscription::create([
            'user_id'    => $user->id,
            'plan'       => $request->plan,
            'status'     => 'activo',
            'start_date' => now(),
            'end_date'   => $endDate,
        ]);

        // Actualizar usuario a PRO
        $user->update(['is_pro' => true]);

        // Enviar email de confirmación
        Mail::to($user->email)->send(new SuscripcionConfirmada($user, $request->plan));

        return response()->json([
            'message' => '¡Bienvenido a Flicka PRO!',
            'user'    => $user->fresh(),
        ]);
    }

    // Cancelar suscripción
    public function destroy(Request $request)
    {
        $user = $request->user();

        if (!$user->is_pro) {
            return response()->json([
                'message' => 'No tienes una suscripción activa'
            ], 400);
        }

        Subscription::where('user_id', $user->id)
            ->where('status', 'activo')
            ->update(['status' => 'inactivo']);

        $user->update(['is_pro' => false]);

        return response()->json([
            'message' => 'Suscripción cancelada correctamente',
            'user'    => $user->fresh(),
        ]);
    }
}