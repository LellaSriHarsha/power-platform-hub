#!/usr/bin/env bash
#
# Publishes the latest Lovable build + source into this repository.
#
# Lovable keeps its own working copy in a separate private repository
# (default: power-platform-hub-7461ccad). This script pulls that export,
# copies the static build into docs/ (which GitHub Pages serves) and mirrors
# the source into app/, then commits and pushes if anything changed.
#
# Usage:
#   ./scripts/sync-from-lovable.sh [git-url-of-lovable-repo]
#
set -euo pipefail

LOVABLE_REPO="${1:-https://github.com/LellaSriHarsha/power-platform-hub-7461ccad.git}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

echo "→ Cloning latest Lovable export"
echo "  $LOVABLE_REPO"
git clone --depth 1 --quiet "$LOVABLE_REPO" "$TMP/lovable"

echo "→ Publishing static build into docs/ (docs/classic is preserved)"
rsync -a --exclude 'classic' "$TMP/lovable/docs/" "$ROOT/docs/"
if [ -f "$TMP/lovable/public/favicon.ico" ]; then cp "$TMP/lovable/public/favicon.ico" "$ROOT/docs/favicon.ico"; fi
if [ -f "$TMP/lovable/public/robots.txt" ];  then cp "$TMP/lovable/public/robots.txt"  "$ROOT/docs/robots.txt";  fi

echo "→ Mirroring application source into app/"
rsync -a --delete \
  --exclude '.git' --exclude 'docs' --exclude 'node_modules' \
  --exclude '.output' --exclude '.nitro' \
  "$TMP/lovable/" "$ROOT/app/"

cd "$ROOT"
git add -A

if git diff --cached --quiet; then
  echo "✓ Nothing to publish — docs/ and app/ are already up to date."
  exit 0
fi

git commit -m "chore: sync build and source from Lovable"
echo "→ Pushing to origin"
git push
echo "✓ Synced, committed and pushed."
echo "  GitHub Pages redeploys automatically in about a minute:"
echo "  https://lellasriharsha.github.io/power-platform-hub/"
