# Vibaro Analytics – KPI-Definitionen

Dieses Dokument legt verbindlich fest, wie Vibaro-Metriken gemessen, berechnet und kommuniziert werden.
Es gilt als Source of Truth für Produkt, Admin-UI und Support.

---

## Grundsatz: Quelle der Wahrheit

| Quelle | Gilt für |
|---|---|
| `ClickEvent`-Tabelle | alle Click-Metriken |
| `PageViewEvent`-Tabelle | alle Visitor-Metriken |
| **Nicht** `TrackingLink.click_count` | Diese Spalte ist ein Display-Cache; kann durch Race Conditions, nachträgliche Preview-Korrekturen oder Datenlücken vor Migrationen vom realen Wert abweichen. |

---

## 1. Pageview

**Definition:** Ein HTTP-Request auf eine öffentliche Künstlerseite, der nicht als Bot oder Preview-Crawler erkannt wurde.

**Zählt als Pageview, wenn:**
- `is_preview = false`
- Kein Deduplizierungstreffer für dieselbe Kombination aus `(artist_page_id, spotlight_id, visitor_key_hash, Kalendertag)`

**Zählt NICHT als Pageview:**
- Requests von bekannten Link-Preview-Crawlern (Telegram, WhatsApp, Facebook, Twitter/X, Discord, Slack u. a. — vollständige Liste in `BotDetectionService`)
- Requests mit User-Agents, die Muster wie `bot`, `crawler`, `spider`, `preview` enthalten
- Vorschau-Aufrufe des Artists selbst (Query-Parameter `?preview=1`)
- Doppelter Aufruf desselben Besuchers am selben Kalendertag im selben Kontext (Dedup, siehe § 3)

**Genauigkeit:** Präzise innerhalb der Bot-Erkennungsreichweite (§ 4).

---

## 2. Unique Visitor

**Definition:** Die Anzahl distinkt identifizierter Besucher eines Künstlerprofils (oder Spotlights) im ausgewählten Zeitraum, basierend auf `PageViewEvent`-Einträgen mit `is_preview = false`.

**Berechnungsformel:**
```sql
COUNT(DISTINCT COALESCE(visitor_key_hash, user_agent_hash))
```

**Visitor Key (`visitor_key_hash`):**  
SHA-256 aus `pve_v1 | ua_hash | coarse_ip_bucket | language_bucket`

| Eingabe | Verarbeitung |
|---|---|
| User-Agent | SHA-256 (nie roh gespeichert) |
| IPv4-Adresse | erstes /24-Subnetz (letzte Oktet entfernt) |
| IPv6-Adresse | erstes /64-Präfix (erste 8 Bytes) |
| Accept-Language | erster Sprach-Tag, normalisiert, max. 16 Zeichen |

**Fallback (Legacy-Daten):** Zeilen ohne `visitor_key_hash`-Spalte (vor Migration) zählen per `user_agent_hash`.

**Approximation – bekannte Einschränkungen:**
- Zwei echte Besucher mit identischem User-Agent, demselben /24-IP-Subnetz **und** derselben Sprache werden als ein Besucher gezählt. In der Praxis sehr selten.
- Besucher mit aktivem VPN oder Tor können als verschiedene Besucher zählen, wenn sich ihr IP-Bucket ändert.
- Die Metrik ist **trendfähig**: Relative Vergleiche (diese Woche vs. letzte Woche, Phase A vs. Phase B) sind aussagekräftig. Absolute Gleichheit mit anderen Analytics-Tools ist nicht garantiert.

**Geeignet für:** Trendvergleiche, relative Wachstumsmessung, Phase-Vergleiche.  
**Nicht geeignet für:** Exakte Reichweiten-Versprechen gegenüber Labeln oder Aggregatoren.

---

## 3. Pageview-Deduplizierung

**Regel:** Pro Besucher wird maximal **ein** Pageview pro Kalendertag pro Kontext gespeichert.

**Kontext** = `(artist_page_id, spotlight_id)` — d. h. ein Besuch ohne aktives Spotlight und ein Besuch mit Spotlight A zählen unabhängig.

**Durchsetzung:** Wird beim Eingang des Requests geprüft (`AnalyticsController::recordPageview`). Doppelte Requests werden mit `204 No Content` quittiert, ohne einen Event zu speichern.

**Zweck:** Verhindert, dass Browser-Reloads oder Hintergrundtabs die Besucherzahl aufblähen.

---

## 4. Bot-Filterung

**Mechanismus:** `BotDetectionService::isPreviewBot()` prüft den `User-Agent`-Header gegen eine Liste bekannter Patterns. Erkannte Bots erhalten `is_preview = true`.

**Gefilterte Kategorien:**
- Social-Media-Link-Vorschauen (Telegram, WhatsApp, Facebook, Twitter/X, Discord, Slack, LinkedIn, Viber, Skype, iMessage)
- Generische Crawler-Signale: `bot`, `crawler`, `spider`, `preview`

**Einschränkung:** Unbekannte oder selbst geschriebene Bots ohne erkennbares UA-Muster werden **nicht** gefiltert.  
**Einschränkung:** Kein IP-basiertes Blocklisting im MVP.

**Alle Abfragebausteine** (`scopeRealViews`, `scopeRealClicks`) schließen `is_preview = true` automatisch aus. Direkte Abfragen ohne Scope müssen `->where('is_preview', false)` explizit setzen.

---

## 5. Click

**Definition:** Ein Eintrag in `ClickEvent` mit `is_preview = false`, der entsteht, wenn ein Besucher auf einen Tracking-Link klickt.

**Nicht dedupliziert:** Mehrfachklicks desselben Besuchers zählen jeweils einzeln. Dies ist bewusste MVP-Entscheidung.

**Erfasste Dimensionen:** `platform`, `placement`, `module`, `campaign`, `referrer_host`, `country_code`

**QR-Scans:** Clicks mit `platform = 'qr'` werden separat als `qr_scans` ausgewiesen und standardmäßig aus dem `top_platform`-Ranking ausgeschlossen.

**Trendfähig:** Ja. Click-Zahlen sind direkte Event-Counts und eignen sich für Zeitreihen und Plattform-Vergleiche.

---

## 6. Conversion Rate

**Formel:**
$$\text{conversion} = \min\!\left(100,\ \frac{\text{total\_clicks}}{\text{unique\_visitors}} \times 100\right)$$

**Einheit:** Prozent (%), gerundet auf eine Nachkommastelle.

**Approximation — bekannte Einschränkungen:**
- Der **Zähler** (`total_clicks`) ist **nicht** dedupliziert. Ein Besucher mit drei Klicks erhöht den Zähler um 3, den Nenner um 1. Das Ergebnis kann rechnerisch über 100 % liegen — daher die Deckelung.
- Die Deckelung auf 100 % ist eine Display-Schutzmaßnahme, kein inhaltlicher Wert.
- Bei sehr kleinen Besucherzahlen (< 10) ist der Wert statistisch wenig aussagekräftig.

**V2-Plan:** Zähler auf `unique_clicks` (dedupliziert per Besucher pro Tag) umstellen.

**Geeignet für:** Trendvergleiche zwischen Phasen.  
**Nicht geeignet für:** Exakte Benchmark-Aussagen; nicht mit E-Commerce-Conversion-Rates vergleichbar.

**Wird `null`**, wenn `unique_visitors = 0`.

---

## 7. Trend-Metriken

| Metrik                          | Trendfähig | Hinweis                                           |
|---------------------------------|------------|---------------------------------------------------|
| Click-Counts (absolut)          | ✅ Ja      | direkte Event-Counts                              |
| Unique Visitors                 | ✅ Ja      | Relative Entwicklung ist verlässlich              |
| Top-Plattform                   | ✅ Ja      | bei ausreichend Daten (≥ 20 Klicks)               |
| Conversion Rate                 | ⚠️ Bedingt | nur zum Phasen-Vergleich; kein externer Benchmark |
| QR-Scans                        | ✅ Ja      | direkte Event-Counts                              |
| Besucher-Trend (7d vs. 14d)     | ✅ Ja      | Prozentuale Abweichung aussagekräftig             |
| Conversion Rate (< 10 Visitors) | ❌ Nein    | zu wenig Datenpunkte                              |

---

## 8. Phasenvergleich (Comparison)

**Semantik:** **Chronologischer** Vergleich — aktuelle Phase vs. letzte beendete Phase (oder die letzten zwei beendeten Phasen falls keine Phase aktiv).

**Kein inhaltlicher Zusammenhang** zwischen den verglichenen Phasen. Es wird nicht geprüft, ob die Releases ähnlich sind. Der Vergleich zeigt: „Wie laufe ich jetzt im Vergleich zu damals?"

**Metriken pro Phase:** `visitors`, `clicks`, `qr_scans`, `conversion`, `top_platform` — alle all-time für den jeweiligen Spotlight.

---

## 9. Datenschutz

- Kein roher User-Agent oder IP je gespeichert.
- `visitor_key_hash`: SHA-256, enthält nur grobe IP-Subnet-Bits und normalisierten Sprach-Tag.
- `user_agent_hash`: SHA-256 des rohen UA-Strings (Legacy-Fallback).
- Ländercodes kommen aus dem Cloudflare-Header `CF-IPCountry` oder einem internen `X-Country-Code` Header — keine IP-Geolokalisierung im Backend.
