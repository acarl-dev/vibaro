<?php

namespace App\Http\Traits;

use Illuminate\Http\JsonResponse;

/**
 * Standard API Response Format
 *
 * Success: { "data": {...} }
 * Error: { "error": { "code": "...", "message": "..." } }
 * Validation: { "error": { "code": "VALIDATION_ERROR", "message": "...", "fields": {...} } }
 */
trait ApiResponse
{
    protected function success(mixed $data, int $status = 200): JsonResponse
    {
        return response()->json(['data' => $data], $status);
    }

    protected function error(string $code, string $message, int $status = 400): JsonResponse
    {
        return response()->json([
            'error' => [
                'code' => $code,
                'message' => $message,
            ]
        ], $status);
    }

    protected function validationError(array $fields, string $message = 'Invalid input'): JsonResponse
    {
        return response()->json([
            'error' => [
                'code' => 'VALIDATION_ERROR',
                'message' => $message,
                'fields' => $fields,
            ]
        ], 422);
    }
}
