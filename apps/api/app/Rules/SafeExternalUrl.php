<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class SafeExternalUrl implements ValidationRule
{
    public function __construct(
        private readonly bool $allowMailto = false,
        private readonly bool $allowTel = false,
    ) {}

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if ($value === null || $value === '') {
            return;
        }

        if (!is_string($value)) {
            $fail('The :attribute must be a valid URL.');

            return;
        }

        $url = trim($value);

        if ($url === '' || preg_match('/[\x00-\x1F\x7F]/', $url)) {
            $fail('The :attribute must be a valid URL.');

            return;
        }

        if (str_starts_with($url, '//')) {
            $fail('The :attribute must use an explicit URL scheme.');

            return;
        }

        if (!preg_match('/^([a-zA-Z][a-zA-Z0-9+.-]*):(.*)$/s', $url, $matches)) {
            $fail('The :attribute must be a valid external URL.');

            return;
        }

        $scheme = strtolower($matches[1]);
        $rest = $matches[2] ?? '';

        // Reject scheme obfuscation like "javascript :".
        if (preg_match('/\s/', $matches[1])) {
            $fail('The :attribute must be a valid URL.');

            return;
        }

        $allowedSchemes = ['https'];

        if ($this->allowInsecureHttp()) {
            $allowedSchemes[] = 'http';
        }

        if ($this->allowMailto) {
            $allowedSchemes[] = 'mailto';
        }

        if ($this->allowTel) {
            $allowedSchemes[] = 'tel';
        }

        if (!in_array($scheme, $allowedSchemes, true)) {
            $fail('The :attribute contains an unsupported URL scheme.');

            return;
        }

        if (in_array($scheme, ['http', 'https'], true)) {
            $host = parse_url($url, PHP_URL_HOST);
            if (!is_string($host) || trim($host) === '') {
                $fail('The :attribute must include a valid host.');

                return;
            }
        }

        if ($scheme === 'mailto' && trim($rest) === '') {
            $fail('The :attribute must contain a valid mailto target.');

            return;
        }

        if ($scheme === 'tel' && trim($rest) === '') {
            $fail('The :attribute must contain a valid telephone target.');
        }
    }

    private function allowInsecureHttp(): bool
    {
        if (app()->environment(['local', 'testing'])) {
            return true;
        }

        return (bool) config('vibaro.security.allow_http_external_urls', false);
    }
}
