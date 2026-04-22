#!/bin/bash
cd /home/alan/dev/vibaro

echo "=== P3-37: Component line counts ==="
wc -l apps/web/src/app/'(public)'/p/components/shared.tsx 2>/dev/null || echo 'shared.tsx NOT FOUND'
wc -l apps/web/src/app/'(studio)'/studio/onboarding/OnboardingClient.tsx 2>/dev/null || echo 'OnboardingClient.tsx NOT FOUND'
wc -l apps/web/src/app/'(studio)'/studio/home/HomeClient.tsx 2>/dev/null || echo 'HomeClient.tsx NOT FOUND'

echo ""
echo "=== P3-37: Components > 500 lines ==="
find apps/web/src \( -name '*.tsx' -o -name '*.ts' \) -print0 | while IFS= read -r -d '' f; do
  lines=$(wc -l < "$f")
  if [ "$lines" -gt 500 ]; then
    echo "$lines $f"
  fi
done | sort -rn

echo ""
echo "=== P3-38: Template files in public/p/components ==="
ls -1 apps/web/src/app/'(public)'/p/components/ 2>/dev/null

echo ""
echo "=== P3-39: ReleaseController line count ==="
wc -l apps/api/app/Http/Controllers/Api/ReleaseController.php 2>/dev/null || echo 'NOT FOUND'

echo ""
echo "=== P3-39: ReleaseMetadataService exists? ==="
ls -la apps/api/app/Services/ReleaseMetadataService.php 2>/dev/null || echo 'ReleaseMetadataService.php NOT FOUND'

echo ""
echo "=== P3-40: AnalyticsController line count ==="
wc -l apps/api/app/Http/Controllers/Api/AnalyticsController.php 2>/dev/null || echo 'NOT FOUND'

echo ""
echo "=== P3-40: Services line counts ==="
wc -l apps/api/app/Services/*.php 2>/dev/null || echo 'No services found'

echo ""
echo "=== P3-41: Dead code - StudioHomeController ==="
ls -la apps/api/app/Http/Controllers/Api/StudioHomeController.php 2>/dev/null || echo 'StudioHomeController.php NOT FOUND'

echo ""
echo "=== P3-41: Dead code - Platform.php ==="
ls -la apps/api/app/Enums/Platform.php 2>/dev/null || echo 'Platform.php NOT FOUND'

echo ""
echo "=== P3-41: Dead code - TrackingLink.php ==="
ls -la apps/api/app/Models/TrackingLink.php 2>/dev/null || echo 'TrackingLink.php NOT FOUND'

echo ""
echo "=== P3-41: Debug scripts ==="
for f in apps/api/check_api.php apps/api/check_schema.php apps/api/fix_spotlights_nullable.php; do
  ls -la "$f" 2>/dev/null || echo "$f NOT FOUND"
done

echo ""
echo "=== P3-41: Empty files ==="
find apps/api/app apps/web/src -type f \( -name '*.php' -o -name '*.tsx' -o -name '*.ts' \) -empty 2>/dev/null

echo ""
echo "=== P3-43: lib/auth and lib/theme dirs ==="
ls -la apps/web/src/lib/auth/ 2>/dev/null || echo 'lib/auth/ NOT FOUND'
ls -la apps/web/src/lib/theme/ 2>/dev/null || echo 'lib/theme/ NOT FOUND'

echo ""
echo "=== P3-41: Platform.php imports check ==="
grep -r "Platform" apps/api/app --include="*.php" -l 2>/dev/null | head -20

echo ""
echo "=== P3-41: StudioHomeController in routes ==="
grep -r "StudioHome" apps/api/routes/ 2>/dev/null || echo 'No StudioHome references in routes'
