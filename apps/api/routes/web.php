<?php

use App\Http\Controllers\TrackingController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Public tracking redirect
Route::get('/t/{slug}', [TrackingController::class, 'redirect'])->name('tracking.redirect');
