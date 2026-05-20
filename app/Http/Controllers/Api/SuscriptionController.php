<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Auth;

class SubscriptionController extends Controller
{
    private function getAccessToken(): string
    {
        $response = Http::withBasicAuth(
            config('services.paypal.client_id'),
            config('services.paypal.secret')
        )->asForm()->post(config('services.paypal.base_url') . '/v1/oauth2/token', [
            'grant_type' => 'client_credentials',
        ]);

        return $response->json('access_token');
    }

    // 1. Crear la suscripción y devolver el link de aprobación
    public function createSubscription(Request $request)
    {
        $token = $this->getAccessToken();

        $response = Http::withToken($token)
            ->post(config('services.paypal.base_url') . '/v1/billing/subscriptions', [
                'plan_id'       => config('services.paypal.plan_id'), // tu Plan ID de PayPal
                'subscriber'    => [
                    'email_address' => Auth::user()->email,
                ],
                'application_context' => [
                    'return_url' => env('FRONTEND_URL') . '/suscripcion/exito',
                    'cancel_url' => env('FRONTEND_URL') . '/suscripcion',
                ],
            ]);

        return response()->json($response->json());
    }

    // 2. Capturar/activar tras la aprobación del usuario
    public function captureSubscription(Request $request)
    {
        $subscriptionId = $request->input('subscription_id');
        $token          = $this->getAccessToken();

        $response = Http::withToken($token)
            ->get(config('services.paypal.base_url') . "/v1/billing/subscriptions/{$subscriptionId}");

        $data = $response->json();

        if ($data['status'] === 'ACTIVE') {
            $user = Auth::user();
            $user->is_pro              = true;
            $user->paypal_subscription_id = $subscriptionId;
            $user->save();

            return response()->json(['success' => true]);
        }

        return response()->json(['success' => false], 400);
    }

    // 3. Cancelar suscripción
    public function cancelSubscription(Request $request)
    {
        $user  = Auth::user();
        $subId = $user->paypal_subscription_id;
        $token = $this->getAccessToken();

        Http::withToken($token)
            ->post(config('services.paypal.base_url') . "/v1/billing/subscriptions/{$subId}/cancel", [
                'reason' => 'Cancelado por el usuario',
            ]);

        $user->is_pro = false;
        $user->paypal_subscription_id = null;
        $user->save();

        return response()->json(['success' => true]);
    }
}