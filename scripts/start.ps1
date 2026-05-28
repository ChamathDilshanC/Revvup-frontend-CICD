# RevvUp frontend — start Expo dev server for Expo Go
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

if (-not (Test-Path node_modules)) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
}

Write-Host "Starting Expo (scan QR with Expo Go app)..." -ForegroundColor Green
npx expo start
