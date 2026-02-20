<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\StudioHomeService;
use Illuminate\Http\Request;

class StudioController extends Controller
{
    protected StudioHomeService $homeService;

    public function __construct(StudioHomeService $homeService)
    {
        $this->homeService = $homeService;
    }

    /**
     * Get Studio Home dashboard data.
     *
     * GET /api/v1/studio/home
     */
    public function home(Request $request)
    {
        $user = $request->user();

        if (!$user->artistPage) {
            return response()->json([
                'error' => [
                    'code' => 'no_artist_page',
                    'message' => 'No artist page found for this user.',
                ],
            ], 404);
        }

        $data = $this->homeService->getHomeData($user);

        return response()->json([
            'data' => $data,
        ]);
    }
}
