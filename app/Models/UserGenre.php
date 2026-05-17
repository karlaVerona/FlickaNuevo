<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserGenre extends Model
{
    protected $table = 'user_genres';

    public $timestamps = false;

    protected $fillable = ['user_id', 'genre', 'position'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}