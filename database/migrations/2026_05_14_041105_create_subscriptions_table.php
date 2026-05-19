<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('plan', ['mensual', 'anual']);
            $table->enum('status', ['activo', 'inactivo']);
            $table->timestamp('start_date')->useCurrent();
            $table->timestamp('end_date')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};