<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Services\StudioHomeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StudioController extends Controller
{
    use ApiResponse;

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
    public function home(Request $request): JsonResponse
    {
        $user = $request->user();
        $data = $this->homeService->getHomeData($user);

        return $this->success($data);
    }
}
