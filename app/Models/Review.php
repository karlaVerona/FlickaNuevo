<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    protected $fillable = [
        'user_id', 'movie_id', 'rating', 'review_text', 'mood', 'is_six_star'
    ];

    public function user()  { return $this->belongsTo(User::class); }
    public function movie() { return $this->belongsTo(Movie::class); }
}