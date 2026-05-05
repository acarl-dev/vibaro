<?php

namespace App\Http\Traits;

use Illuminate\Http\Request;

trait NormalizesUrlInput
{
    /**
     * Trim URL fields and map empty strings to null before validation.
     *
     * @param  list<string>  $fields
     */
    protected function normalizeUrlInput(Request $request, array $fields): void
    {
        $merged = [];

        foreach ($fields as $field) {
            if (!$request->exists($field)) {
                continue;
            }

            $value = $request->input($field);

            if (!is_string($value)) {
                continue;
            }

            $trimmed = trim($value);
            $merged[$field] = $trimmed === '' ? null : $trimmed;
        }

        if ($merged !== []) {
            $request->merge($merged);
        }
    }
}
