<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('movie_id')->constrained()->onDelete('cascade');
            $table->decimal('rating', 2, 1)->nullable();
            $table->text('review_text')->nullable();
            $table->enum('mood', [
                'Risa explosiva', 'Inspirador', 'Cozy', 'Nudo en la garganta',
                'Nostalgia pura', 'Al borde del asiento', 'Corazón al mil',
                'Incomodidad', 'Misterio', 'Crisis existencial', 'Mind-bending',
                'Reflexivo', 'Empoderado'
            ])->nullable();
            $table->boolean('is_six_star')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};