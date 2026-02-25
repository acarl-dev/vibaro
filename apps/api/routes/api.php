<?php

use App\Http\Controllers\Api\AnalyticsController;
use App\Http\Controllers\Api\ArtistPageController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CampaignController;
use App\Http\Controllers\Api\FeaturedTrackController;
use App\Http\Controllers\Api\GalleryImageController;
use App\Http\Controllers\Api\LinkController;
use App\Http\Controllers\Api\PublicArtistPageController;
use App\Http\Controllers\Api\ReleaseController;
use App\Http\Controllers\Api\ShowController;
use App\Http\Controllers\Api\SpotlightController;
use App\Http\Controllers\Api\StudioController;
use App\Http\Controllers\Api\TrackingLinkController;
use App\Http\Controllers\Api\VideoController;
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

    // Pageview tracking (public – no auth required)
    Route::post('/analytics/pageview', [AnalyticsController::class, 'recordPageview']);

    // Auth (public)
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);

    // Artist Search (public)
    Route::get('/artist-pages/search', [ArtistPageController::class, 'search']);

    // Auth (protected)
    Route::middleware('auth:sanctum')->group(function () {
        // Artist Page (private)
        Route::get('/artist-pages/me', [ArtistPageController::class, 'me']);
        Route::post('/artist-pages', [ArtistPageController::class, 'store']);
        Route::post('/artist-pages/upload-avatar', [ArtistPageController::class, 'uploadAvatar']);
        Route::post('/artist-pages/upload-hero', [ArtistPageController::class, 'uploadHero']);
        Route::post('/artist-pages/upload-logo', [ArtistPageController::class, 'uploadLogo']);
        Route::patch('/artist-pages/update-hero-focal', [ArtistPageController::class, 'updateHeroFocal']);
        Route::delete('/artist-pages/delete-avatar', [ArtistPageController::class, 'deleteAvatar']);
        Route::delete('/artist-pages/delete-hero', [ArtistPageController::class, 'deleteHero']);
        Route::delete('/artist-pages/delete-logo', [ArtistPageController::class, 'deleteLogo']);
        Route::post('/handles/check', [ArtistPageController::class, 'checkHandle']);
        Route::patch('/artist-pages/{id}', [ArtistPageController::class, 'update']);
        Route::patch('/artist-pages/{artistPage}/sections', [ArtistPageController::class, 'updateSections']);
        Route::post('/artist-pages/{id}/publish', [ArtistPageController::class, 'publish']);
        Route::post('/artist-pages/{id}/unpublish', [ArtistPageController::class, 'unpublish']);

        // Links (private CRUD)
        Route::get('/artist-pages/me/links', [LinkController::class, 'myLinks']);
        Route::get('/artist-pages/{id}/links', [LinkController::class, 'index']);
        Route::post('/artist-pages/{id}/links', [LinkController::class, 'store']);
        Route::patch('/artist-pages/{id}/links/{linkId}', [LinkController::class, 'update']);
        Route::delete('/artist-pages/{id}/links/{linkId}', [LinkController::class, 'destroy']);
        Route::post('/artist-pages/{id}/links/reorder', [LinkController::class, 'reorder']);

        // Shows (private CRUD)
        Route::get('/artist-pages/{id}/shows', [ShowController::class, 'index']);
        Route::post('/artist-pages/{id}/shows', [ShowController::class, 'store']);
        Route::patch('/artist-pages/{id}/shows/{showId}', [ShowController::class, 'update']);
        Route::delete('/artist-pages/{id}/shows/{showId}', [ShowController::class, 'destroy']);
        Route::post('/artist-pages/{id}/shows/reorder', [ShowController::class, 'reorder']);
        Route::post('/artist-pages/{id}/shows/{showId}/upload-flyer', [ShowController::class, 'uploadFlyer']);
        Route::delete('/artist-pages/{id}/shows/{showId}/flyer', [ShowController::class, 'deleteFlyer']);

        // Releases (private CRUD)
        Route::get('/artist-pages/{id}/releases', [ReleaseController::class, 'index']);
        Route::post('/artist-pages/{id}/releases', [ReleaseController::class, 'store']);
        Route::patch('/artist-pages/{id}/releases/{releaseId}', [ReleaseController::class, 'update']);
        Route::delete('/artist-pages/{id}/releases/{releaseId}', [ReleaseController::class, 'destroy']);
        Route::post('/artist-pages/{id}/releases/reorder', [ReleaseController::class, 'reorder']);
        Route::post('/artist-pages/{id}/releases/{releaseId}/upload-cover', [ReleaseController::class, 'uploadCover']);
        Route::delete('/artist-pages/{id}/releases/{releaseId}/cover', [ReleaseController::class, 'deleteCover']);

        // Featured Tracks (private CRUD)
        Route::get('/artist-pages/{id}/featured-tracks', [FeaturedTrackController::class, 'index']);
        Route::post('/artist-pages/{id}/featured-tracks', [FeaturedTrackController::class, 'store']);
        Route::patch('/artist-pages/{id}/featured-tracks/{trackId}', [FeaturedTrackController::class, 'update']);
        Route::delete('/artist-pages/{id}/featured-tracks/{trackId}', [FeaturedTrackController::class, 'destroy']);
        Route::post('/artist-pages/{id}/featured-tracks/reorder', [FeaturedTrackController::class, 'reorder']);

        // Videos (private CRUD)
        Route::get('/studio/videos', [VideoController::class, 'index']);
        Route::post('/studio/videos', [VideoController::class, 'store']);
        Route::patch('/studio/videos/{id}', [VideoController::class, 'update']);
        Route::delete('/studio/videos/{id}', [VideoController::class, 'destroy']);
        Route::post('/studio/videos/reorder', [VideoController::class, 'reorder']);
        Route::post('/studio/videos/{id}/featured', [VideoController::class, 'toggleFeatured']);

        // Gallery Images (private CRUD)
        Route::get('/studio/gallery', [GalleryImageController::class, 'index']);
        Route::post('/studio/gallery', [GalleryImageController::class, 'store']);
        Route::post('/studio/gallery/reorder', [GalleryImageController::class, 'reorder']);
        Route::patch('/studio/gallery/{id}', [GalleryImageController::class, 'update']);
        Route::delete('/studio/gallery/{id}', [GalleryImageController::class, 'destroy']);

        // Analytics (V2 Stage)
        Route::get('/analytics/overview', [AnalyticsController::class, 'overview']);
        Route::get('/analytics/breakdown', [AnalyticsController::class, 'breakdown']);
        Route::get('/analytics/comparison', [AnalyticsController::class, 'comparison']);

        // Studio (V2 Home Dashboard)
        Route::get('/studio/home', [StudioController::class, 'home']);

        // Spotlights (V2 Stage)
        Route::get('/spotlights/active', [SpotlightController::class, 'active']);
        Route::get('/spotlights/fetch-metadata', [SpotlightController::class, 'fetchMetadata']);
        Route::get('/spotlights', [SpotlightController::class, 'index']);
        Route::post('/spotlights', [SpotlightController::class, 'store']);
        Route::patch('/spotlights/{id}', [SpotlightController::class, 'update']);
        Route::post('/spotlights/{id}/activate', [SpotlightController::class, 'activate']);
        Route::post('/spotlights/{id}/end', [SpotlightController::class, 'end']);
        Route::patch('/spotlights/{spotlight}/show-on-page', [SpotlightController::class, 'toggleShowOnPage']);
        Route::post('/spotlights/{id}/archive', [SpotlightController::class, 'archive']);
        Route::post('/spotlights/{id}/restore', [SpotlightController::class, 'restore']);
        Route::delete('/spotlights/{id}', [SpotlightController::class, 'destroy']);

        // Campaigns (Stage Pro)
        Route::get('/campaigns', [CampaignController::class, 'index']);
        Route::post('/campaigns', [CampaignController::class, 'store']);
        Route::patch('/campaigns/{id}', [CampaignController::class, 'update']);
        Route::delete('/campaigns/{id}', [CampaignController::class, 'destroy']);

        // Tracking Links (V2 Stage)
        Route::get('/tracking-links', [TrackingLinkController::class, 'index']);
        Route::get('/tracking-links/check', [TrackingLinkController::class, 'check']);
        Route::post('/tracking-links', [TrackingLinkController::class, 'store']);
        Route::patch('/tracking-links/{trackingLink}/archive', [TrackingLinkController::class, 'archive']);
        Route::delete('/tracking-links/{id}', [TrackingLinkController::class, 'destroy']);

        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
    });
});
