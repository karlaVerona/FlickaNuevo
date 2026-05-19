<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
// app/Models/Report.php
class Report extends Model
{
    protected $fillable = [
        'reporter_id', 'reportable_type', 'reportable_id',
        'type', 'description', 'status'
    ];

    public function reporter() { return $this->belongsTo(User::class, 'reporter_id'); }
    public function reportable() { return $this->morphTo(); }
}