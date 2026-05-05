import test, { afterEach, beforeEach } from "node:test";
import assert from "node:assert/strict";
import {
  consumeRateLimit,
  createIpRateLimitKey,
  createLoginEmailRateLimitKey,
  resetRateLimitStore,
} from "./_lib/rate-limit.ts";

beforeEach(() => {
  resetRateLimitStore();
});

afterEach(() => {
  resetRateLimitStore();
});

test("login limiter blocks repeated attempts for same ip+email", () => {
  const key = createLoginEmailRateLimitKey("203.0.113.10", "band@example.com");
  const config = { maxAttempts: 10, windowMs: 60_000 };

  for (let i = 0; i < 10; i += 1) {
    const result = consumeRateLimit(key, config);
    assert.equal(result.allowed, true);
  }

  const blocked = consumeRateLimit(key, config);

  assert.equal(blocked.allowed, false);
  assert.ok(blocked.retryAfterSeconds >= 1);
});

test("register limiter blocks repeated attempts for same ip", () => {
  const key = createIpRateLimitKey("register", "203.0.113.10");
  const config = { maxAttempts: 10, windowMs: 60_000 };

  for (let i = 0; i < 10; i += 1) {
    const result = consumeRateLimit(key, config);
    assert.equal(result.allowed, true);
  }

  const blocked = consumeRateLimit(key, config);

  assert.equal(blocked.allowed, false);
  assert.ok(blocked.retryAfterSeconds >= 1);
});

test("normal attempts remain allowed below configured limit", () => {
  const loginIpKey = createIpRateLimitKey("login", "203.0.113.10");
  const registerIpKey = createIpRateLimitKey("register", "203.0.113.10");

  const loginResult = consumeRateLimit(loginIpKey, {
    maxAttempts: 25,
    windowMs: 60_000,
  });

  const registerResult = consumeRateLimit(registerIpKey, {
    maxAttempts: 10,
    windowMs: 60_000,
  });

  assert.equal(loginResult.allowed, true);
  assert.equal(registerResult.allowed, true);
});
