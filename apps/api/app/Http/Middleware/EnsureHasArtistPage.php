<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Ensure the authenticated user has an artist page.
 *
 * On success, binds the artist page to $request->attributes
 * so controllers can retrieve it via $request->attributes->get('artistPage').
 */
class EnsureHasArtistPage
{
    public function handle(Request $request, Closure $next): Response
    {
        $artistPage = $request->user()?->artistPage;

        if (!$artistPage) {
            return response()->json([
                'error' => [
                    'code' => 'NO_ARTIST_PAGE',
                    'message' => 'No artist page found for this user.',
                ],
            ], 404);
        }

        $request->attributes->set('artistPage', $artistPage);

        return $next($request);
    }
}
