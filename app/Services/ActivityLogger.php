<?php
// app/Services/ActivityLogger.php
namespace App\Services;

use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

class ActivityLogger
{
    public static function log(
        string $action,
        string $targetType = null,
        int    $targetId   = null,
        array  $metadata   = []
    ): void {
        ActivityLog::create([
            'user_id'     => Auth::id(),
            'action'      => $action,
            'target_type' => $targetType,
            'target_id'   => $targetId,
            'metadata'    => $metadata,
            'ip_address'  => Request::ip(),
        ]);
    }
}