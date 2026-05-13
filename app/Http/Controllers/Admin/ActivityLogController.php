<?php

// app/Http/Controllers/Admin/ActivityLogController.php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;

class ActivityLogController extends Controller
{
    // GET /api/admin/activity
    public function index()
    {
        return response()->json(
            ActivityLog::with('user')
                       ->latest()
                       ->paginate(50)
        );
    }
}