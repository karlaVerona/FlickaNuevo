<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('list_movies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('list_id')->constrained()->onDelete('cascade');
            $table->foreignId('movie_id')->constrained()->onDelete('cascade');
            $table->unique(['list_id', 'movie_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('list_movies');
    }
};