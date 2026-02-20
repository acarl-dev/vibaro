<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\StudioHomeService;

class StudioHomeController extends Controller
{
    /**
     * Get Studio home dashboard data.
     */
    public function __invoke(StudioHomeService $service)
    {
        $user = auth()->user();
        
        if (!$user->artistPage) {
            return response()->json([
                'error' => [
                    'code' => 'no_artist_page',
                    'message' => 'No artist page found for this user.',
                ],
            ], 404);
        }

        return response()->json([
            'data' => $service->getHomeData($user),
        ]);
    }
}
