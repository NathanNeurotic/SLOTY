# Quick launcher for Slotz Dev Server
$env:PATH = $env:PATH.Replace('"', '')
node ./node_modules/vite/bin/vite.js
