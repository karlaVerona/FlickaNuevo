<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'plan',
        'status',
        'start_date',
        'end_date',
    ];
}