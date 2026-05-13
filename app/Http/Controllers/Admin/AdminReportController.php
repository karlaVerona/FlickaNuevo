<?php

// app/Http/Controllers/Admin/AdminReportController.php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Report;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;

class AdminReportController extends Controller
{
    // GET /api/admin/reports
    public function index()
    {
        return response()->json(
            Report::with('reporter', 'reportable')
                  ->where('status', 'pending')
                  ->latest()
                  ->paginate(20)
        );
    }

    // POST /api/admin/reports/{report}/resolve
    public function resolve(Report $report)
    {
        $report->update(['status' => 'resolved']);
        ActivityLogger::log('resolved_report', 'Report', $report->id);

        return response()->json(['message' => 'Reporte resuelto.']);
    }

    // POST /api/admin/reports/{report}/dismiss
    public function dismiss(Report $report)
    {
        $report->update(['status' => 'dismissed']);
        ActivityLogger::log('dismissed_report', 'Report', $report->id);

        return response()->json(['message' => 'Reporte descartado.']);
    }
}
