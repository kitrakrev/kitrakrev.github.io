#!/bin/sh
# Build locally and publish dist/ to the gh-pages branch (no GitHub Actions needed).
set -e
cd "$(dirname "$0")"
GITHUB_TOKEN=$(gh auth token -u kitrakrev) npm run build
touch dist/.nojekyll
cd dist
rm -rf .git && git init -q && git checkout -q -b gh-pages
git add -A && git -c user.name=kitrakrev -c user.email=kitrakrev@users.noreply.github.com commit -qm "Deploy $(date -u +%Y-%m-%dT%H:%MZ)"
T=$(gh auth token -u kitrakrev)
git -c "http.https://github.com/.extraheader=AUTHORIZATION: basic $(printf 'x-access-token:%s' "$T" | base64)" push -qf https://github.com/kitrakrev/kitrakrev.github.io.git gh-pages
rm -rf .git
echo "deployed"
