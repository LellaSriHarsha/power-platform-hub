#!/usr/bin/env bash
#
# Applies repo-owned growth/SEO patches to docs/ after a Lovable sync.
#
# Lovable owns the app bundle (docs/index.html, docs/robots.txt) and
# overwrites them on every sync. This script re-injects the pieces that
# Lovable will never produce on its own:
#
#   1. SEO/social meta pack into docs/index.html  (canonical, Open Graph,
#      Twitter cards, JSON-LD structured data — content: scripts/growth-pack.html)
#   2. Enhancement layers into docs/index.html (hub-plus.js deep links/share,
#      pa-functions.js Power Automate library, hub-lab.js playground power-ups,
#      hub-theme.js light-mode code fixes, hub-data.js Dataverse/SharePoint,
#      hub-ai.js AI Builder + Copilot Studio, hub-journey.js journey features,
#      hub-study.js unified Study Hub)
#      — files live in docs/, survive syncs
#   3. Sitemap line in docs/robots.txt
#   4. Footer version bump (v1.0 → v2.0) + GitHub repo link
#
# Everything is idempotent: running it twice changes nothing.
# It is called automatically by scripts/sync-from-lovable.sh, and can also
# be run standalone:  ./scripts/apply-growth-patches.sh
#
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SITE="https://lellasriharsha.github.io/power-platform-hub/"
INDEX="$ROOT/docs/index.html"
ROBOTS="$ROOT/docs/robots.txt"
PACK="$ROOT/scripts/growth-pack.html"

# --- 1. SEO/social meta pack into docs/index.html -------------------------
if [ -f "$INDEX" ] && [ -f "$PACK" ]; then
  if grep -q 'POWERVERSE growth-pack' "$INDEX"; then
    echo "✓ Meta pack already present in docs/index.html"
  else
    python3 - "$INDEX" "$PACK" <<'PYEOF'
import sys
index_path, pack_path = sys.argv[1], sys.argv[2]
html = open(index_path, encoding='utf-8').read()
pack = open(pack_path, encoding='utf-8').read()
pos = html.lower().rfind('</head>')
if pos == -1:
    sys.exit('error: </head> not found in docs/index.html')
open(index_path, 'w', encoding='utf-8').write(html[:pos] + pack + '\n' + html[pos:])
PYEOF
    echo "→ Injected SEO/social meta pack into docs/index.html"
  fi
fi

# --- 2. repo-owned enhancement layers into docs/index.html -----------------
# hub-plus.js      — deep links, share buttons (core)
# pa-functions.js  — Power Automate expression library + Fx/PA tab
# hub-lab.js       — playground power-ups: history, favorites, import data,
#                    export, challenges
# hub-theme.js     — light-mode code readability fixes
# hub-data.js      — Dataverse/SharePoint functions, snippets pane, questions
# hub-ai.js        — AI Builder + Copilot Studio topics, questions
# hub-journey.js   — interview progress, difficulty filters, certifications
#                    (wires all .iq items/chips incl. the ones
#                    hub-data/hub-ai inject)
# hub-study.js     — unified #study hub (Power Apps / Automate / Pages /
#                    AI Builder / Copilot tabs), video links, nav scroll
#                    affordance, hero stat sync
#                    (MUST stay LAST: relocates hub-ai sections + counts)
for layer in hub-plus.js pa-functions.js hub-lab.js hub-theme.js hub-data.js hub-ai.js hub-journey.js hub-study.js; do
  if [ -f "$INDEX" ] && [ -f "$ROOT/docs/$layer" ]; then
    if grep -q "$layer" "$INDEX"; then
      echo "✓ $layer already wired into docs/index.html"
    else
      LAYER="$layer" python3 - "$INDEX" <<'PYEOF'
import os, sys
p = sys.argv[1]
html = open(p, encoding='utf-8').read()
tag = '<script src="%s" defer></script>\n' % os.environ['LAYER']
pos = html.lower().rfind('</body>')
if pos == -1:
    sys.exit('error: </body> not found in docs/index.html')
open(p, 'w', encoding='utf-8').write(html[:pos] + tag + html[pos:])
PYEOF
      echo "→ Wired $layer into docs/index.html"
    fi
  fi
done

# --- 3. Sitemap line in docs/robots.txt -----------------------------------
if [ -f "$ROBOTS" ] && ! grep -q '^Sitemap:' "$ROBOTS"; then
  printf '\nSitemap: %ssitemap.xml\n' "$SITE" >> "$ROBOTS"
  echo "→ Added Sitemap line to docs/robots.txt"
fi

# --- 4. Footer: version bump + GitHub link --------------------------------
if [ -f "$INDEX" ] && grep -q 'v1\.0 · runs 100% in your browser' "$INDEX"; then
  python3 - "$INDEX" <<'PYEOF'
import sys
p = sys.argv[1]
html = open(p, encoding='utf-8').read()
old = '<span>v1.0 · runs 100% in your browser</span>'
new = ('<span>v2.0 · runs 100% in your browser · open source on '
       '<a href="https://github.com/LellaSriHarsha/power-platform-hub" '
       'target="_blank" rel="noopener" style="color:inherit;text-decoration:underline">GitHub</a></span>')
open(p, 'w', encoding='utf-8').write(html.replace(old, new, 1))
PYEOF
  echo "→ Updated footer: v2.0 + GitHub repo link"
fi

echo "✓ Growth patches applied."
