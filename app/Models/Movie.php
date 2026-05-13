<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Movie extends Model
{
    protected $table = 'movies';

    protected $fillable = [
        'title',
        'anio',
        'director',
        'genre',
        'synopsis',
        'poster'
    ];
}