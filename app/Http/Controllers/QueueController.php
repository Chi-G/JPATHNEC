<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;

class QueueController extends Controller
{
    /**
     * Process queued jobs via HTTP endpoint
     * This is useful for shared hosting environments
     */
    public function processJobs(Request $request)
    {
        // Add basic security - you can enhance this
        $token = $request->header('X-Queue-Token') ?? $request->get('token');
        $expectedToken = env('QUEUE_TOKEN', 'your-secret-token');

        if ($token !== $expectedToken) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 401);
        }

        try {
            Log::info('Processing queued jobs via HTTP endpoint');

            // Process jobs with a timeout
            Artisan::call('queue:work', [
                '--stop-when-empty' => true,
                '--tries' => 3,
                '--timeout' => 30,
            ]);

            $output = Artisan::output();

            Log::info('Queue processing completed via HTTP', [
                'output' => $output
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Jobs processed successfully',
                'output' => $output
            ]);

        } catch (\Exception $e) {
            Log::error('Queue processing failed via HTTP', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Queue processing failed: ' . $e->getMessage()
            ], 500);
        }
    }
}
