<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Movie extends Model
{
    protected $fillable = [
        'title', 'director', 'anio', 'genre', 'synopsis', 'poster'
    ];

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}