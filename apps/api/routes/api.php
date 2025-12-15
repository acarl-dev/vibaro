<?php

use App\Http\Controllers\Api\ArtistPageController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PublicArtistPageController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| All routes are prefixed with /api/v1
|
*/

Route::prefix('v1')->group(function () {
    // Public Artist Page
    Route::get('/p/{handle}', [PublicArtistPageController::class, 'show']);

    // Auth (public)
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);

    // Auth (protected)
    Route::middleware('auth:sanctum')->group(function () {
        // Artist Page (private)
        Route::get('/artist-pages/me', [ArtistPageController::class, 'me']);
        Route::post('/artist-pages', [ArtistPageController::class, 'store']);
        Route::patch('/artist-pages/{id}', [ArtistPageController::class, 'update']);

        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
    });
});
