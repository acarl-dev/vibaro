<?php

use App\Http\Controllers\TrackingController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Public tracking redirect with rate limiting
// Rate limit: 60 requests per minute per IP+slug combination
Route::get('/t/{slug}', [TrackingController::class, 'redirect'])
    ->middleware('throttle:tracking')
    ->name('tracking.redirect');
