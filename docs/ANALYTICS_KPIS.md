# Vibaro Analytics - KPI Definitions

This document defines in a binding way how Vibaro metrics are measured, calculated, and communicated.
It serves as the source of truth for product, admin UI, and support.

---

## Principle: Source of Truth

| Source | Applies to |
|---|---|
| `ClickEvent` table | all click metrics |
| `PageViewEvent` table | all visitor metrics |
| **Not** `TrackingLink.click_count` | This column is a display cache; it may deviate from the real value due to race conditions, later preview corrections, or data gaps before migrations. |

---

## 1. Pageview

**Definition:** An HTTP request to a public artist page that was not detected as a bot or preview crawler.

**Counts as a pageview if:**
- `is_preview = false`
- No deduplication hit for the same combination of `(artist_page_id, spotlight_id, visitor_key_hash, calendar_day)`

**Does NOT count as a pageview:**
- Requests from known link preview crawlers (Telegram, WhatsApp, Facebook, Twitter/X, Discord, Slack, etc. - full list in `BotDetectionService`)
- Requests with user agents containing patterns like `bot`, `crawler`, `spider`, `preview`
- Artist self-preview requests (query parameter `?preview=1`)
- Duplicate request by the same visitor on the same calendar day in the same context (dedup, see Section 3)

**Accuracy:** Precise within the reach of bot detection (Section 4).

---

## 2. Unique Visitor

**Definition:** The number of distinctly identified visitors of an artist profile (or spotlight) in the selected period, based on `PageViewEvent` entries with `is_preview = false`.

**Calculation formula:**
```sql
COUNT(DISTINCT COALESCE(visitor_key_hash, user_agent_hash))
```

**Visitor key (`visitor_key_hash`):**  
SHA-256 of `pve_v1 | ua_hash | coarse_ip_bucket | language_bucket`

| Input | Processing |
|---|---|
| User-Agent | SHA-256 (never stored raw) |
| IPv4 address | first /24 subnet (last octet removed) |
| IPv6 address | first /64 prefix (first 8 bytes) |
| Accept-Language | first language tag, normalized, max. 16 characters |

**Fallback (legacy data):** Rows without `visitor_key_hash` column (before migration) are counted via `user_agent_hash`.

**Approximation - known limitations:**
- Two real visitors with the same user agent, the same /24 IP subnet **and** the same language are counted as one visitor. In practice, this is very rare.
- Visitors using VPN or Tor may be counted as different visitors if their IP bucket changes.
- This metric is **trend-capable**: Relative comparisons (this week vs. last week, phase A vs. phase B) are meaningful. Absolute equality with other analytics tools is not guaranteed.

**Suitable for:** Trend comparisons, relative growth measurement, phase comparisons.  
**Not suitable for:** Exact reach promises to labels or aggregators.

---

## 3. Pageview Deduplication

**Rule:** A maximum of **one** pageview per visitor per calendar day per context is stored.

**Context** = `(artist_page_id, spotlight_id)` - meaning a visit without an active spotlight and a visit with spotlight A are counted independently.

**Enforcement:** Checked on incoming request (`AnalyticsController::recordPageview`). Duplicate requests are acknowledged with `204 No Content` without storing an event.

**Purpose:** Prevents browser reloads or background tabs from inflating visitor numbers.

---

## 4. Bot Filtering

**Mechanism:** `BotDetectionService::isPreviewBot()` checks the `User-Agent` header against a list of known patterns. Detected bots are marked with `is_preview = true`.

**Filtered categories:**
- Social media link previews (Telegram, WhatsApp, Facebook, Twitter/X, Discord, Slack, LinkedIn, Viber, Skype, iMessage)
- Generic crawler signals: `bot`, `crawler`, `spider`, `preview`

**Limitation:** Unknown or custom bots without recognizable UA patterns are **not** filtered.  
**Limitation:** No IP-based blocklisting in the MVP.

**All query scopes** (`scopeRealViews`, `scopeRealClicks`) automatically exclude `is_preview = true`. Direct queries without scope must explicitly set `->where('is_preview', false)`.

---

## 5. Click

**Definition:** An entry in `ClickEvent` with `is_preview = false`, created when a visitor clicks a tracking link.

**Not deduplicated:** Multiple clicks from the same visitor are counted individually. This is a deliberate MVP decision.

**Captured dimensions:** `platform`, `placement`, `module`, `campaign`, `referrer_host`, `country_code`

**QR scans:** Clicks with `platform = 'qr'` are reported separately as `qr_scans` and are excluded from `top_platform` ranking by default.

**Trend-capable:** Yes. Click counts are direct event counts and are suitable for time series and platform comparisons.

---

## 6. Conversion Rate

**Formula:**
$$\text{conversion} = \min\!\left(100,\ \frac{\text{total\_clicks}}{\text{unique\_visitors}} \times 100\right)$$

**Unit:** Percent (%), rounded to one decimal place.

**Approximation - known limitations:**
- The **numerator** (`total_clicks`) is **not** deduplicated. One visitor with three clicks increases the numerator by 3, the denominator by 1. The result can mathematically exceed 100% - hence the cap.
- The cap at 100% is a display safeguard, not a substantive value.
- For very small visitor counts (< 10), the value is statistically not very meaningful.

**V2 plan:** Switch numerator to `unique_clicks` (deduplicated per visitor per day).

**Suitable for:** Trend comparisons between phases.  
**Not suitable for:** Exact benchmark claims; not comparable with e-commerce conversion rates.

**Becomes `null`** when `unique_visitors = 0`.

---

## 7. Trend Metrics

| Metric                          | Trend-capable | Note                                              |
|---------------------------------|---------------|---------------------------------------------------|
| Click counts (absolute)         | Yes           | direct event counts                               |
| Unique visitors                 | Yes           | Relative development is reliable                  |
| Top platform                    | Yes           | with sufficient data (>= 20 clicks)              |
| Conversion rate                 | Conditional   | only for phase comparison; no external benchmark  |
| QR scans                        | Yes           | direct event counts                               |
| Visitor trend (7d vs. 14d)      | Yes           | Percentage deviation is meaningful                |
| Conversion rate (< 10 visitors) | No            | too few data points                               |

---

## 8. Phase Comparison

**Semantics:** **Chronological** comparison - current phase vs. last completed phase (or the last two completed phases if no phase is active).

**No semantic relation** is assumed between compared phases. It is not checked whether releases are similar. The comparison answers: "How am I performing now compared to then?"

**Metrics per phase:** `visitors`, `clicks`, `qr_scans`, `conversion`, `top_platform` - all-time for the respective spotlight.

---

## 9. Data Privacy

- No raw user agent or IP is ever stored.
- `visitor_key_hash`: SHA-256, containing only coarse IP subnet bits and normalized language tag.
- `user_agent_hash`: SHA-256 of the raw UA string (legacy fallback).
- Country codes come from the Cloudflare header `CF-IPCountry` or an internal `X-Country-Code` header - no IP geolocation in the backend.
