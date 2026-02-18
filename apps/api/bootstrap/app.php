<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
        then: function () {
            // Configure rate limiters
            RateLimiter::for('tracking', function (Request $request) {
                // Rate limit by IP + slug combination
                // 60 requests per minute per IP+slug
                $slug = $request->route('slug');
                $key = $request->ip() . '|' . $slug;
                
                return Limit::perMinute(60)->by($key);
            });
        }
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->api(prepend: [
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
            \Illuminate\Http\Middleware\HandleCors::class,
        ]);
        
        // API should return 401, not redirect to login
        $middleware->redirectGuestsTo(fn () => abort(401, 'Unauthenticated'));
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
